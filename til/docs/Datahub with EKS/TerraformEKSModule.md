---
id: terraform_eks_module
title: EKS Datahub 4 Terraform EKS Module
sidebar_position: 4
tags:
    - AWS
    - EKS
    - Terraform
    - Datahub with EKS
---

# EKS - Datahub - 4 Terraform EKS Module

Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik

### 래퍼런스

여기서는 아래 책을 참고하여 진행하였습니다. 

[처음 시작하는 마이크로서비스 - YES24](http://www.yes24.com/Product/Goods/102805240)

Terraform, EKS, Traefik, Argocd 등 전반적으로 다 알려주고 있습니다!
혹시나 관심있으신 분들은 꼭 읽어보시는 것을 추천드립니다!

### EKS를 시작하기 전에..

EKS(Elastic Kubernetes Service)는 AWS에서 제공하는 관리형 쿠버네티스 서비스입니다.

EKS를 사용하면 쿠버네티스의 설치부터, 운영을 EKS가 대신 해줍니다.

쿠버네티스의 구현은 매우 복잡하며, 가능한 빠르게 시스템을 설정하고 실행하기 위해서 EKS를 사용합니다.

<aside>
❓ 쿠버네티스?

[쿠버네티스란 무엇인가?](https://kubernetes.io/ko/docs/concepts/overview/what-is-kubernetes/)

> 예를 들어 컨테이너가 다운되면 다른 컨테이너를 다시 시작해야 한다. 이 문제를 시스템에 의해 처리한다면 더 쉽지 않을까? 그것이 쿠버네티스가 필요한 이유이다! **쿠버네티스는 분산 시스템을 탄력적으로 실행하기 위한 프레임 워크를 제공한다**. 애플리케이션의 확장과 장애 조치를 처리하고, 배포 패턴 등을 제공한다. 예를 들어, 쿠버네티스는 시스템의 카나리아 배포를 쉽게 관리 할 수 있다.
> 
</aside>

### 모듈 생성

EKS역시 테라폼으로 관리할 예정이기에 EKS에 관련된 테라폼 코드 역시 모듈로 관리합니다. 

`eks_module` 폴더를 생성하고 코드를 작성할 파일들을 생성합니다.

파일 이름은 네트워크 모듈 생성할 때 사용했던 파일 이름을 그대로 사용합니다.

`main.tf` : 모듈이 실행되는 파일

`variables.tf` : 모듈의 input값을 관리하는 파일

`outputs.tf` :모듈의 output값을 관리하는 파일, 만약 output이 없는 경우 해당 파일 생성을 하지 않을 수 있습니다.

### `output.tf`

> EKS 모듈이 제공하는 출력 변수를 선언하는 파일입니다.
> 

```python
output "eks_cluster_id" {
  value = aws_eks_cluster.aib-cluster.id
}

output "eks_cluster_name" {
  value = aws_eks_cluster.aib-cluster.name
}

output "eks_cluster_certificate_data" {
  value = aws_eks_cluster.aib-cluster.certificate_authority.0.data
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.aib-cluster.endpoint
}

output "eks_cluster_nodegroup_id" {
  value = aws_eks_node_group.node-group.id
}

output "eks_cluster_security_group_id" {
  value = aws_security_group.cluster.id
}
```

EKS 모듈을 통해 생성한 EKS 정보들을 반환할 수 있도록 구성합니다.

생성된 EKS의 클러스터 id, 클러스터 이름, 클러스터 인증서, 클러스터 엔드포인트, 클러스터 노드 그룹 id, 클러스터 보안 그룹 id를 반환합니다.

이렇게 출력된 변수들은 다른 모듈에서 해당 클러스터에 접근 할 수 있도록 합니다.

다음 글에서 작성될 ArgoCD를 해당 클러스터에 설치할 때 EKS의 엔드포인트와 인증서가 필요합니다. 

### `main.tf`

> EKS 클러스터가 정의되어있는 파일입니다.
> 

```python
provider "aws" {
  region = var.aws_region
}
```

공급자 정의를 합니다. 

AWS의 EKS를 사용하므로 AWS 공급자를 정의합니다.

모듈이 호출될 때 리전 정보를 받아올 수 있도록 하였습니다. 외부에서 여러 모듈을 실행하는 경우 서로 같은 리전에서 실행될 수 있도록 하며, 유지보수성을 높일 수 있습니다. 

```python
resource "aws_iam_role" "cluster" {
  name = var.cluster_name

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "cluster-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.cluster.name
}
```

EKS를 실행하려면 AWS 리소스를 생성하고 수정할 수 있는 권한이 있어야합니다.

위 코드를 통해 EKS서비스에 대한 새로운 자격 증명과 접근 정책을 정의하고 `[AmazoneEKSClusterPolicy](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/service_IAM_role.html)` 정책을 연결합니다.

`[aws_iam_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role)` 테라폼 리소스를 사용하여 aws 역할을 생성합니다. 

이후 `[aws_iam_role_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment)` 테라폼 리소스를 통해 생성한 aws 역할에  `[AmazoneEKSClusterPolicy](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/service_IAM_role.html)` 정책을 연결합니다.

참고 레퍼런스

[Amazon EKS 클러스터 IAM 역할](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/service_IAM_role.html)

여기서 사용되는 클러스터 이름은 다른 곳에서도 사용되므로 변수로 관리합니다.

클러스터 서비스의 역할과 정책을 정의하였으므로, 다음에는 클러스터에 대한 네트워크 보안 정책을 정의합니다.

```python
resource "aws_security_group" "cluster" {
  name        = var.cluster_name
  description = "Cluster communication with worker nodes"
  vpc_id      = var.vpc_id

  ingress {
    description = "Inbound traffic from within the security group"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    self        = true
  }

  tags = {
    Owner       = "aib"
    Environment = "dev"
  }
}
```

이전에 정의한 네트워크 모듈을 통해 생성된 VPC 정보를 사용하여 클러스터의 네트워크 보안 정책을 생성합니다.

`[aws_security_group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/security_group)` 테라폼 리소스를 통해 보안그룹을 생성할 수 있습니다. 

이렇게 정책과 보안그룹을 정의하였으면, 이를 이용하여 EKS 클러스터를 생성할 수 있습니다.

```python
resource "aws_eks_cluster" "aib-cluster" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    security_group_ids = [aws_security_group.cluster.id]
    subnet_ids         = var.cluster_subnet_ids
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster-AmazonEKSClusterPolicy
  ]
}
```

`[aws_eks_cluster](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_cluster)` 테라폼 리소스를 사용하여 EKS 클러스터를 정의할 수 있습니다. 

클러스터의 이름과, 앞서 정의한 정책, 보안그룹, 그리고 네트워크 모듈을 통해 생성한 서브넷들을 연결해줍니다.

이렇게 EKS 클러스터를 생성하면 쿠버네티스 클러스터를 생성하기 위해 필요한 모든 관리 구성 요소가 자동으로 설정됩니다. 그리고 이는 쿠버네티스 시스템에서 두뇌 역할을 하는 [컨트롤 플레인](https://kubernetes.io/ko/docs/concepts/overview/components/#%EC%BB%A8%ED%8A%B8%EB%A1%A4-%ED%94%8C%EB%A0%88%EC%9D%B8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8)의 역할을 합니다.

이제는 컨트롤 플레인과 함께 여러 서비스들이 실행될 장소, 노드들이 필요합니다. 

노드 역시 테라폼으로 정의합니다.

정의하기 전 EKS 클러스터를 생성하기 전에 역할을 생성해주었듯이 노드 역시 역할이 필요합니다.

노드 생성에 사용할 역할을 먼저 생성해줍니다.

```python
resource "aws_iam_role" "node" {
  name = "${var.cluster_name}.node"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "node-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.node.name
}

resource "aws_iam_role_policy_attachment" "node-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.node.name
}

resource "aws_iam_role_policy_attachment" "node-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.node.name
}
```

`[aws_iam_role](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role)` 테라폼 리소스를 사용하여 aws 역할을 생성합니다. 

이후 `[aws_iam_role_policy_attachment](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment)` 테라폼 리소스를 통해 생성한 aws 역할에 필요한 정책을 연결합니다.

해당 역할에 연결되는 정책은 `AmazonEKSWorkerNodePolicy`, `AmazonEKS_CNI_Policy` , `AmazonEC2ContainerRegistryReadOnly` 입니다.

참고 레퍼런스 

[Amazon EKS 노드 IAM 역할](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/create-node-role.html)

[서비스 계정에 IAM 역할을 사용하도록 Amazon VPC CNI 플러그인 구성](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/cni-iam-role.html)

정책 생성후 EKS 노드 그룹을 정의할 수 있습니다.

```python
resource "aws_eks_node_group" "node-group" {
  cluster_name    = aws_eks_cluster.aib-cluster.name
  node_group_name = "aib-eks"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.nodegroup_subnet_ids

  scaling_config {
    desired_size = var.nodegroup_desired_size
    max_size     = var.nodegroup_max_size
    min_size     = var.nodegroup_min_size
  }

  disk_size      = var.nodegroup_disk_size
  instance_types = var.nodegroup_instance_types

  depends_on = [
    aws_iam_role_policy_attachment.node-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node-AmazonEC2ContainerRegistryReadOnly,
  ]
}
```

`[aws_eks_node_group](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eks_node_group)` 테라폼 리소스를 사용하여 노드그룹을 정의합니다.

노드그룹을 정의하는데 사용되는 정보

`cluster_name` : EKS 클러스터 이름, 변수로 사용합니다.

`node_group_name` : 노드 그룹의 이름

`node_role_arn` : 노드의 정책, 위에서 생성한 역할을 사용합니다.

`subnet_ids` : 서브넷 아이디들, 네트워크 모듈로 생성된 서브넷을 사용합니다.

`scaling_config` : 노드의 스케일 정의

`desired_size` : 워커 노드의 갯수

`max_size` : 워커 노드의 최댓값

`min_size` : 워커 노드의 최솟값

`disk_size` : 워커 노드의 디스크 사이즈 

`instance_types` : 워커 노드의 인스턴스 사이즈, `t3.medium` 이 기본 값

`depends_on` : 워커 노드와 연결될 정책들, 위에서 생성한 정책을 연결해줍니다.

사용되는 대부분의 값들을 변수로 받아서 사용하게 구성하였습니다.

해당 모듈 외부에서 쉽게 값을 확인하고 변경할 수 있습니다.

노드 그룹들에 대해서 정의를 하였다면 EKS에 대한 설정은 끝입니다.

마지막으로는 EKS로 생성된 쿠버네티스 관리에 사용되는 kubectl을 사용할 수 있도록 
kubectl의 구성을 위해 세부 연결 정보를 제공하는 작업이 필요합니다.

<aside>
❓ kubectl?

[kubectl 개요](https://kubernetes.io/ko/docs/reference/kubectl/overview/)

쿠버네티스 클러스터를 제어할 수 있는 커멘드 라인 도구입니다.
사용을 하기 위해서는 [kubeconfig](https://kubernetes.io/ko/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 파일을 통해 쿠버네티스와 kubectl 연결이 필요합니다.

</aside>

```python
resource "local_file" "kubeconfig" {
  content  = <<KUBECONFIG
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${aws_eks_cluster.aib-cluster.certificate_authority.0.data}
    server: ${aws_eks_cluster.aib-cluster.endpoint}
  name: ${aws_eks_cluster.aib-cluster.arn}
contexts:
- context:
    cluster: ${aws_eks_cluster.aib-cluster.arn}
    user: ${aws_eks_cluster.aib-cluster.arn}
  name: ${aws_eks_cluster.aib-cluster.arn}
current-context: ${aws_eks_cluster.aib-cluster.arn}
kind: Config
preferences: {}
users:
- name: ${aws_eks_cluster.aib-cluster.arn}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      command: aws-iam-authenticator
      args:
        - "token"
        - "-i"
        - "${aws_eks_cluster.aib-cluster.name}"
    KUBECONFIG
  filename = "kubeconfig"
}
```

`[local_file](https://registry.terraform.io/providers/hashicorp/local/latest/docs/resources/file)` 테라폼 리소스를 사용하여 위에서 생성된 EKS 정보들을 바탕으로 kubeconfig파일을 작성하고 로컬로 내려받을 수 있도록 코드를 작성합니다.

[다중 클러스터 접근 구성](https://kubernetes.io/ko/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)

위 레퍼런스를 통해서 `kubectl` 에서 사용하는 `kubeconfig` 파일을 생성하는 방법을 확인할 수 있습니다.

### `variable.tf`

> 위 `main.tf` 파일에서 사용한 변수들을 여기서 정의합니다.
> 

```python
variable "aws_region" {
  description = "AWS region ID for deployment (e.g. ap-northeast-2)"
  type        = string
  default     = "ap-northeast-2"
}

variable "env_name" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "cluster_subnet_ids" {
  type = list(string)
}

variable "nodegroup_subnet_ids" {
  type = list(string)
}

variable "nodegroup_desired_size" {
  type    = number
  default = 1
}

variable "nodegroup_min_size" {
  type    = number
  default = 1
}

variable "nodegroup_max_size" {
  type    = number
  default = 5
}

variable "nodegroup_disk_size" {
  type = string
}

variable "nodegroup_instance_types" {
  type = list(string)
}
```

### EKS 모듈 사용

EKS 모듈을 구성했다면 이제 외부에서 사용해야합니다.

이전 테라폼 백엔드를 선언했던 `main.tf` 파일에서 네트워크 모듈을 사용해줍니다.

`variable.tf` 파일에 선언되어있는 변수들에 값을 전부 넣어주어야합니다.

```python
module "aws-kubernetes-cluster" {
  source = "./eks_module"

  env_name           = local.name
  aws_region         = local.region
  cluster_name       = local.k8s_cluster_name
  vpc_id             = module.aws-network.vpc_id
  cluster_subnet_ids = module.aws-network.subnet_ids

  nodegroup_subnet_ids     = module.aws-network.private_subnet_ids
  nodegroup_disk_size      = "20"
  nodegroup_instance_types = ["t3.medium"]
  nodegroup_desired_size   = 2
  nodegroup_min_size       = 1
  nodegroup_max_size       = 5
}
```

디스크 사이즈는 20GB, 노드그룹의 인스턴스 타입은 기본값인 `t3.medium` 을 사용하였습니다.

노드그룹의 사이즈는 2, 최솟값1, 최댓값은 5로 구성하였습니다.

추후 [autoscaler](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/cluster-autoscaler.html) 추가를 통해 EKS에서 노드그룹의 사이즈를 적절하게 조절할 수 있도록 구성하려합니다.

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

테라폼이 실행된 후 클러스터가 정상적으로 생성되었는지 확인해볼 수 있습니다.

```python
aws eks list-clusters
```