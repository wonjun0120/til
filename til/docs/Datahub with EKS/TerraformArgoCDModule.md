---
id: terraform_argocd_module
title: EKS Datahub 5 Terraform ArgoCD Module
sidebar_position: 5
tags:
    - AWS
    - EKS
    - Terraform
    - ArgoCD
    - GitOps
    - Datahub with EKS
---

# EKS - Datahub - 5 Terraform ArgoCD Module

Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik

### 래퍼런스

여기서는 아래 책을 참고하여 진행하였습니다. 

[처음 시작하는 마이크로서비스 - YES24](http://www.yes24.com/Product/Goods/102805240)

Terraform, EKS, Traefik, Argocd 등 전반적으로 다 알려주고 있습니다!
혹시나 관심있으신 분들은 꼭 읽어보시는 것을 추천드립니다!

### 들어가기 전에.. GitOps?

[GitOps란?](https://www.redhat.com/ko/topics/devops/what-is-gitops)

[GitOps와 ArgoCD](https://coffeewhale.com/kubernetes/gitops/argocd/2020/02/10/gitops-argocd/)

GitOps? 

프로젝트에 데브옵스를 적용하는 실천 방법중 하나입니다. 

그 중에서도 클라우드 네이티브 애플리케이션을 대상으로 한 지속적 배포에 초점을 두고 있습니다.

GitOps에서 요구하는 원칙들을 정리해보았습니다. (위 커피고래님 레퍼런스에서 참고하였습니다)

1. 선언형 배포 작업 정의서
2. Git을 이용한 배포 버전 관리
3. 변경 사항 운영 반영 자동화
4. 자가 치유 및 이상 감지

### Argo CD?

위에서 잠깐 살펴본 GitOps의 구현체인 Argo CD를 EKS에 애플리케이션을 배포하는데 사용합니다. 

kubectl과 helm을 사용하여 바로 배포해도 되지만 배포 진행시 파드들이 정상적으로 실행되고 있는지, 에러가 발생하지는 않았는지 확인이 어렵습니다. 

<aside>
❓ helm?
쿠버네티스 클러스터에서 패키지를 관리하는 패키지 매니저입니다!

[헬름 사용하기](https://helm.sh/ko/docs/intro/using_helm/)

</aside>

특히 EKS에서 진행하려하는 데이터 허브 배포 진행시 정말 많은 파드들이 실행되기에 현재 파드들의 상태를 더 쉽게 확인할 수 있는 방법이 필요했습니다. 

<img width="752" alt="Argocd" src="https://user-images.githubusercontent.com/38996611/149650524-7c822024-5084-42cf-8275-367749732e67.png">

실행중인 Datahub의 파드들.. 

이를 해결하기 위해 GitOps의 구현체인 Argo CD를 사용하게 되었습니다. 

### Argo CD Terraform 모듈

EKS를 테라폼으로 생성할 때 같이 설치 될 수 있도록 Argo CD 역시 테라폼으로 관리해줍니다.

`argocd_module` 이라는 이름의 폴더를 만들어줍니다. 

<aside>
✋ 테라폼 모듈에서 helm을 사용하는 경우 

테라폼 모듈의 경우 내부에서 사용하는 helm의 이름과 모듈 이름이 같으면 버그가 발생합니다..  
모듈 이름을 지을 때 helm의 이름과 같지 않도록 조심해주세요.

[https://github.com/hashicorp/terraform-provider-helm/issues/735](https://github.com/hashicorp/terraform-provider-helm/issues/735)

</aside>

이전 다른 모듈을 생성했을 때와 마찬가지로 `main.tf` `variables.tf` 파일을 생성해줍니다.

해당 모듈을 통해 Argo CD를 생성하고, 생성된 정보를 바탕으로 작업하는 내용이 없기 때문에 `outputs.tf`파일은 생성하지 않았습니다

`main.tf` : 모듈이 실행되는 파일

`variables.tf` : 모듈의 input값을 관리하는 파일

### `main.tf`

> Argo CD를 설치하는 파일입니다.
> 

Argo CD를 EKS에 설치하기 위해 테라폼에 쿠버네티스 공급자와 헬름 공급자를 추가합니다.

```python
provider "kubernetes" {
  cluster_ca_certificate = base64decode(var.kubernetes_cluster_cert_data)
  host                   = var.kubernetes_cluster_endpoint
  exec {
    api_version = "client.authentication.k8s.io/v1alpha1"
    command     = "aws-iam-authenticator"
    args        = ["token", "-i", "${var.kubernetes_cluster_name}"]
  }
}

provider "helm" {
  kubernetes {
    cluster_ca_certificate = base64decode(var.kubernetes_cluster_cert_data)
    host                   = var.kubernetes_cluster_endpoint
    exec {
      api_version = "client.authentication.k8s.io/v1alpha1"
      command     = "aws-iam-authenticator"
      args        = ["token", "-i", "${var.kubernetes_cluster_name}"]
    }
  }
}
```

이전에 생성한 EKS 클러스터의 속성을 사용하여 `[kubernetes](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs)` 공급자를 구성합니다.

EKS 모듈을 통해 생성한 EKS 클러스터에서 인증서 정보와 클러스터 엔드포인트를 받아와 사용합니다.

`exec` 플러그인을 사용하여 공급자를 구성하기 전에 새로운 토큰을 받을 수 있도록 합니다.

[](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs#exec-plugins)

다음으로는 `[helm](https://registry.terraform.io/providers/hashicorp/helm/latest/docs)` 공급자를 구성합니다. 역시 바로 위에서 쿠버네티스 공급자를 구성한 것과 마찬가지로 작성합니다.

이렇게 작성이 완료되었으면 이제 helm으로 Argo CD를 설치할 수 있습니다.

```python
resource "kubernetes_namespace" "argo-ns" {
  metadata {
    name = "argocd"
  }
}

resource "helm_release" "argocd" {
  name       = "aib-eks-argocd"
  chart      = "argo-cd"
  repository = "https://argoproj.github.io/argo-helm"
  namespace  = "argocd"
}
```

쿠버네티스에는 [namespace](https://kubernetes.io/ko/docs/concepts/overview/working-with-objects/namespaces/)라는 개념이 있습니다. 

하나의 쿠버네티스 클러스터에서 여러 애플리케이션을 설치하는 경우 네임스페이스를 통해 애플리케이션을 구성하는 리소스를 격리할 수 있습니다.

Argo CD를 설치하기 전 ArgoCD만의 네임스페이스를 생성해줍니다.

`[kubernetes_namespace](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace)` 테라폼 리소스를 사용하면 됩니다.

이제 생성한 네임스페이스 안에 Argo CD를 설치해줍니다. 

`[helm_release](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release)` 테라폼 리소스를 사용하여 설치할 수 있습니다. 

Argo CD를  Helm으로 설치하기 위해서는 먼저 helm 레포 추가가 필요합니다.

Argo CD helm Github 에서 Argo CD helm 레포 주소를 확인할 수 있습니다

[https://github.com/argoproj/argo-helm](https://github.com/argoproj/argo-helm)

레포를 추가한 뒤에는 chart 선택이 필요합니다. 

위 레포에서 `charts` 폴더에 있는 여러 chart들 중 `argo-cd` 를 사용할 것이기 때문에 `argo-cd` 를 입력해줍니다.

이렇게 Argo CD를 helm을 사용하여 테라폼으로 설치할 수 있도록 구성하였습니다.

### `variables.tf`

> `main.tf` 파일에서 사용하는 변수를 정의하는 파일입니다.
> 

위에서 사용한 변수들을 정의합니다

```python
variable "aws_region" {
  description = "AWS region ID for deployment"
  type        = string
  default     = "ap-northeast-2"
}

variable "kubernetes_cluster_id" {
  type = string
}

variable "kubernetes_cluster_cert_data" {
  type = string
}

variable "kubernetes_cluster_endpoint" {
  type = string
}

variable "kubernetes_cluster_name" {
  type = string
}

variable "eks_nodegroup_id" {
  type = string
}
```

### Argo CD 모듈 적용

모듈을 생성하였으니 이제 외부에서 사용할 차례입니다.

이전 테라폼 백엔드를 선언했던 `main.tf` 파일에서 네트워크 모듈을 사용해줍니다.

`variable.tf` 파일에 선언되어있는 변수들에 값을 전부 넣어주어야합니다.

```python
module "argo-cd-server" {
  source = "./argocd_module"

  aws_region            = local.region
  kubernetes_cluster_id = module.aws-kubernetes-cluster.eks_cluster_id

  kubernetes_cluster_name      = module.aws-kubernetes-cluster.eks_cluster_name
  kubernetes_cluster_cert_data = module.aws-kubernetes-cluster.eks_cluster_certificate_data
  kubernetes_cluster_endpoint  = module.aws-kubernetes-cluster.eks_cluster_endpoint

  eks_nodegroup_id = module.aws-kubernetes-cluster.eks_cluster_nodegroup_id
}
```

EKS 모듈에서 받아온 값을 넣을 수 있도록 코드를 작성해줍니다.

### 마무리

위에 있는 테라폼 코드를 전부 작성하였다면 테라폼 명령어를 입력할 차례입니다.

```bash
terraform fmt .
terraform init
terraform validate
terraform plan
```

코드 테스트 후 문제가 없다는 것을 확인하였다면 apply를 해줍니다

```python
terraform apply
```

여기까지 Argo CD를 Terraform으로 설치하는 방법입니다.

다음 글에서 ArgoCD를 접속하여 애플리케이션을 배포하는 방법을 확인할 수 있습니다.