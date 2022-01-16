---
id: terraform_network_module
title: EKS Datahub 3 Terraform Network Module
sidebar_position: 3
tags:
    - AWS
    - EKS
    - Terraform
    - Network
    - VPC
    - Datahub with EKS
---

# EKS - Datahub - 3 Terraform Network Module

Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik

### 래퍼런스

여기서부터는 아래 책을 바탕으로 진행하였습니다. 

[처음 시작하는 마이크로서비스 - YES24](http://www.yes24.com/Product/Goods/102805240)

Terraform, EKS, Traefik, Argocd 등 전반적으로 다 알려주고 있습니다!
혹시나 관심있으신 분들은 꼭 읽어보시는 것을 추천드립니다!

### Network 들어가기 앞서..

EKS를 본격적으로 생성하기 전에 EKS에 대해서 VPC를 생성해주어야합니다. 

VPC란 Virtual Private Cloud, 가상 사설 클라우드입니다. 

VPC 개념은 아래 래퍼런스 참고해주세요.

[[AWS] 가장쉽게 VPC 개념잡기](https://medium.com/harrythegreat/aws-%EA%B0%80%EC%9E%A5%EC%89%BD%EA%B2%8C-vpc-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-71eef95a7098)

제일 이해하기 쉬웠던 VPC 설명입니다.

[만들면서 배우는 아마존 VPC(Amazon VPC) 입문: AWS 네트워크의 기초](https://www.44bits.io/ko/post/understanding_aws_vpc)

EKS를 사용하기 위한 VPC 레퍼런스들 입니다. 

[Amazon EKS 클러스터에 대해 VPC 생성](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/create-public-private-vpc.html)

[클러스터 VPC 고려 사항](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/network_reqs.html)

### Network with Terraform

이제 테라폼으로 VPC를 생성해주려고 합니다. 

유지보수를 위해 이전에 만든 `[main.tf](http://main.tf)` 파일에는 너무 많은 코드가 들어가지 않도록 각 설정마다 모듈로 관리하려합니다. 

VPC 관련 모듈, EKS관련 모듈과 같이 관리를 통해 가독성을 높이고, 유지보수성을 높이려합니다.

VPC 모듈로 `network_module` 이라는 이름의 폴더를 생성해주었습니다. 

테라폼 모듈을 3개의 파일로 관리하려합니다. 

`main.tf` : 모듈이 실행되는 파일

`variables.tf` : 모듈의 input값을 관리하는 파일

`outputs.tf` :모듈의 output값을 관리하는 파일, 만약 output이 없는 경우 해당 파일 생성을 하지 않을 수 있습니다.

해당 모듈을 통해 가용영역은 2개, 각 가용영역별로 공개, 비공개 서브넷을 하나씩 생성하여 총 4개의 서브넷으로 구성된 VPC를 생성하려합니다.

2개의 가용영역을 구성하는 이유는 AWS EKS 공식문서의 [클러스터 VPC 고려사항](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/network_reqs.html)중 

> Amazon EKS 클러스터를 생성할 때 Amazon EKS가 탄력적 네트워크 인터페이스를 배치할 수 있는 VPC 서브넷을 지정합니다. **Amazon EKS는 최소 2개의 가용 영역에 서브넷이 필요하며, 노드와의 제어 플레인 통신을 용이하게 하기 위해 이러한 서브넷에 최대 4개의 네트워크 인터페이스를 생성합니다.**
> 

라는 문구가 있어 2개의 가용영역을 생성해주게 되었습니다. 

조금 더 자세한 EKS VPC 네트워크는 추후에 더 공부하려합니다.

테라폼으로 AWS VPC를 생성해야하므로 AWS VPC Terraform module을 사용합니다. 

AWS VPC Terraform module 공식문서

[](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest)

### `output.tf`

> 여기서는 network_module을 통해 생성되는 VPC의 id와 subnet의 id를 모듈의 결과로 반환할 수 있도록 작성해줍니다.
> 

```bash
output "vpc_id" { # 모듈로 생성된 vpc id입니다
  value = aws_vpc.main.id
}

output "subnet_ids" { # 모듈로 생성된 subnet의 ids입니다
  value = [
    aws_subnet.public-subnet-a.id,
    aws_subnet.public-subnet-b.id,
    aws_subnet.private-subnet-a.id,
  aws_subnet.private-subnet-b.id]
}

output "public_subnet_ids" { # 모듈로 생성된 공개 subnet의 ids입니다
  value = [aws_subnet.public-subnet-a.id, aws_subnet.public-subnet-b.id]
}

output "private_subnet_ids" { # 모듈로 생성된 비공개 subnet의 ids입니다
  value = [aws_subnet.private-subnet-a.id, aws_subnet.private-subnet-b.id]
}
```

### `main.tf`

> network_module이 실질적으로 실행되는 파일입니다. 
코드가 길어 부분별로 잘라서 본문에 작성되었습니다.
> 

```bash
provider "aws" {
  region = var.aws_region
}

## AWS VPC 정의
resource "aws_vpc" "main" {
  cidr_block           = var.main_vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    "Name"                                      = var.vpc_name,
    "kubernetes.io/cluster/${var.cluster_name}" = "shared",
  }
}
```

AWS 공급자 선언으로부터 시작합니다. 공급자를 선언하는 경우 테라폼이 작업을 진행할 AWS 리전이 있어야합니다. 

여기서는 `variable.tf` 파일을 통한 input값에 맞추어 지정할 수 있도록 합니다.

다음은 VPC를 생성하기 위한 코드를 정의합니다. 

여기서는 사이더 블록과 태그를 지정합니다. 

<aside>
❓ CIDR(사이더)란?

[사이더 (네트워킹) - 위키백과, 우리 모두의 백과사전](https://ko.wikipedia.org/wiki/%EC%82%AC%EC%9D%B4%EB%8D%94_(%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%82%B9))

네트워크나 서브넷에서 허용하는 IP 주소를 정의하는 축약형 문자열로 네트워크 IP 주소 범위를 설명하는 표준 방법입니다.

</aside>

사이더 블록도 외부에서 값을 받아 지정할 수 있도록 변수를 활용합니다.

AWS는 VPC용 DNS서버를 지원합니다. (Route 53 Resolver)

[VPC에 대한 DNS 지원](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-dns.html)

`enable_dns_support` : 기본 VPC에서 DNS 호스트 이름을 활성화

`enable_dns_hostnames` : 기본 VPC에서 DNS 지원을 활성화

태그를 지정하는 이유는 태그 추가를 통해 리소스 그룹을 쉽게 식별하고 관리할 수 있기 때문입니다. 

VPC를 쉽게 식별할 수 있도록 Name 태그를 정의하고, 쿠버네티스 클러스터를 식별하는 쿠버네티스 태그도 정의합니다. 

VPC용 DNS서버를 사용하기 위해 활성화 옵션을 사용했습니다.

여기서 사용하기 위한 도메인을 생성해줍니다.

```bash
resource "aws_route53_zone" "private-zone" {
  name          = "${var.name}.${var.vpc_name}.com"
  force_destroy = true

  vpc {
    vpc_id = aws_vpc.main.id
  }
}
```

`[aws_route53_zone](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53_zone)` 테라폼 리소스를 사용하여 도메인을 생성합니다.

다음은 서브넷 정의입니다.

`output.tf` 에 선언된 것과 같이 총 4개의 서브넷을 구성해야합니다. 

테라폼 aws subnet 모듈

[](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/subnet)

서브넷을 구성하는데 필요한 값은 `vpc_id` , `cidr_block`, `availability_zone` 입니다. 

`vpc_id` : 서브넷이 속할 VPC의 id입니다, 위 코드를 통해 생성된 VPC id를 사용합니다

`cidr_block` : 각 서브넷 별로 지정이 필요합니다, 외부에서 값을 받아 사용할 수 있도록 변수를 활용합니다.

`availability_zone` : 2개의 가용영역을 사용하여 각 가용영역별로 2개의 서브넷을 구성할 예정이기 때문에 
가용영역을 서브넷별로 따로 지정해주어야합니다.

이를 구현하기 위해서는 가용영역에 대한 정보가 필요합니다.

[](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/availability_zones)

`aws_availability_zones` 테라폼 데이터 소스를 사용하여 가용영역을 받아와 사용합니다.

해당 데이터 소스를 통해 받아온 가용영역 0번째 인덱스는 subnet-a, 1번째 인덱스는 subnet-b로 활용합니다.

코드로 확인하면 아래와 같습니다.

```bash
data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public-subnet-a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_a_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    "Name"                                      = "${var.vpc_name}-public-subnet-a"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }
}

resource "aws_subnet" "public-subnet-b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.public_subnet_b_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    "Name"                                      = "${var.vpc_name}-public-subnet-b"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                    = "1"
  }
}

resource "aws_subnet" "private-subnet-a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_a_cidr
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    "Name"                                      = "${var.vpc_name}-private-subnet-a"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }
}

resource "aws_subnet" "private-subnet-b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_b_cidr
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    "Name"                                      = "${var.vpc_name}-private-subnet-b"
    "kubernetes.io/cluster/${var.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"           = "1"
  }
}
```

관리자와 운영자 콘솔을 통해서 네트워크 리소스를 쉽게 찾을 수 있도록 Name 태그를 추가해줍니다.

EKS에서 네트워크 로드 밸런싱을 사용할 수 있도록 태그를 사용해주었습니다.

이에 대한 설명은 아래 공식문서에서 자세하게 확인할 수 있습니다

[Amazon EKS의 네트워크 로드 밸런싱](https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/network-load-balancing.html)

4개의 서브넷을 구성한 뒤에는 AWS가 트래픽을 관리하는데 필요한 네트워크 규칙을 정의해야합니다. 

서브넷에 허용할 트래픽 소스를 정의하는 라우팅 테이블을 설정하려합니다. 

[라우팅 테이블 - 위키백과, 우리 모두의 백과사전](https://ko.wikipedia.org/wiki/%EB%9D%BC%EC%9A%B0%ED%8C%85_%ED%85%8C%EC%9D%B4%EB%B8%94)

먼저 두 공개 서브넷에 대한 라우팅 규칙을 정의합니다.

인터넷에서 서브넷에 접근할 수 있도록 하기 위해서는 인터넷 게이트웨이를 사용해야합니다.

aws 인터넷 게이트웨이 공식문서

[인터넷 게이트웨이](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/VPC_Internet_Gateway.html)

```HCL
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.vpc_name}-igw"
  }
}

resource "aws_route_table" "public-route" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    "Name" = "${var.vpc_name}-public-route"
  }
}

resource "aws_route_table_association" "public-a-association" {
  subnet_id      = aws_subnet.public-subnet-a.id
  route_table_id = aws_route_table.public-route.id
}

resource "aws_route_table_association" "public-b-association" {
  subnet_id      = aws_subnet.public-subnet-b.id
  route_table_id = aws_route_table.public-route.id
}
```

제일 먼저 인터넷 게이트웨이 리소스를 VPC에 추가해줍니다.

이때는 위에서 생성된 VPC에 대한 id를 활용하여 인터넷 게이트웨이를 생성해줍니다.

테라폼의 `[aws_internet_gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/internet_gateway)` 리소스를 사용하여 인터넷 게이트웨이를 생성할 수 있습니다.

역시 관리자 콘솔에서 쉽게 확인할 수 있도록 태그를 알아줍니다.

그 후, 게이트웨이에서 서브넷으로 트래픽을 라우팅하는 방법을 AWS에 알리는 라우팅 규칙을 정의합니다. 

그러기 위해서는 라우팅 테이블이 필요하며, 테라폼의 `[aws_route_table](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table)` 리소스를 사용하여 생성해줍니다.

라우팅 테이블에서는 인터넷의 모든 트래픽 (CIDR 0.0.0.0/0)을 게이트웨이를 통해 처리할 수 있도록 구성합니다.

이후 공개 서브넷과 라우팅 테이블간의 연결을 생성해줍니다. 

테라폼의 `[aws_route_table_association](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association)` 리소스를 사용하여 서브넷과 라우팅 테이블을 연결할 수 있습니다.

공개 서브넷에 대한 라우팅 경로를 정의한 뒤에는 사설 서브넷에 대한 라우팅 설정을 진행해야합니다.

쿠버네티스의 파드가 EKS 서비스와 통신할 수 있도록 사설 서브넷에서 인터넷으로 나가는 경로를 지정해야합니다. 

이를 위해 사설 서브넷에서 공개 서브넷에 배포된 인터넷 게이트웨이와 통신할 수 있는 방법이 필요합니다. 

AWS는 이를 위해 NAT 게이트웨이 리소스를 제공합니다. 

[NAT 게이트웨이](https://docs.aws.amazon.com/ko_kr/vpc/latest/userguide/vpc-nat-gateway.html)

NAT을 생성하기 위해서는 특별한 IP 주소인 [EIP](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)(Elastic IP adress / 탄력적 IP 주소)를 할당해야합니다.

여기서는 2개의 EIP를 생성하여 NAT에 할당해줍니다.

```HCL
resource "aws_eip" "nat-a" {
  vpc = true
  tags = {
    "Name" = "${var.vpc_name}-NAT-a"
  }
}

resource "aws_eip" "nat-b" {
  vpc = true
  tags = {
    "Name" = "${var.vpc_name}-NAT-b"
  }
}

resource "aws_nat_gateway" "nat-gw-a" {
  allocation_id = aws_eip.nat-a.id
  subnet_id     = aws_subnet.public-subnet-a.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    "Name" = "${var.vpc_name}-NAT-gw-a"
  }
}

resource "aws_nat_gateway" "nat-gw-b" {
  allocation_id = aws_eip.nat-b.id
  subnet_id     = aws_subnet.public-subnet-b.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    "Name" = "${var.vpc_name}-NAT-gw-b"
  }
}
```

`[aws_eip](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/eip)` 테라폼 리소스를 사용하여 eip를 생성해줍니다.

`[aws_nat_gateway](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/nat_gateway)` 테라폼 리소스를 사용하여 생성한 eip를 할당하고 생성했던 공개서브넷을 연결해줍니다. 

올바른 순서를 보장해주기 위해 위에서 생성했던 인터넷 게이트웨이에 대한 명시적 종속성을 추가해줍니다.

NAT 게이트웨이를 구성한 뒤에는 사설 서브넷(private subnet)에 대한 라우팅을 정의해줍니다.

```HCL
esource "aws_route_table" "private-route-a" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat-gw-a.id
  }

  tags = {
    "Name" = "${var.vpc_name}-private-route-a"
  }
}

resource "aws_route_table" "private-route-b" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat-gw-b.id
  }

  tags = {
    "Name" = "${var.vpc_name}-private-route-b"
  }
}

resource "aws_route_table_association" "private-a-association" {
  subnet_id      = aws_subnet.private-subnet-a.id
  route_table_id = aws_route_table.private-route-a.id
}

resource "aws_route_table_association" "private-b-association" {
  subnet_id      = aws_subnet.private-subnet-b.id
  route_table_id = aws_route_table.private-route-b.id
}
```

위에서 공개 서브넷에 대한 라우팅을 정의해줄 때와 마찬가지로 테라폼의 `[aws_route_table](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table)` 리소스를 통해 먼저 라우팅 테이블을 구성합니다. 단 이때는 인터넷 게이트웨이가 아닌 바로 위에서 구성한 NAT 게이트웨이를 사용합니다. 

라우팅 테이블을 생성한 뒤에는 테라폼의 `[aws_route_table_association](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route_table_association)` 리소스를 사용하여 사설 서브넷과 라우팅 테이블을 연결해줍니다.

여기까지 진행하였다면 테라폼을 통한 네트워크 모듈의 `main.tf` 가 끝이 났습니다.

생성된 네트워크의 모습은 아래 사진처럼 구성되었습니다.

![vpc](https://user-images.githubusercontent.com/38996611/149650404-5e344cc5-7cd9-4ded-8461-0e84ff3b71a5.png)

### `variable.tf`

> `main.tf` 파일에서 사용한 변수들을 여기서 정의합니다.
> 

```bash
variable "name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "vpc_name" {
  type = string
}

variable "main_vpc_cidr" {
  type = string
}

variable "public_subnet_a_cidr" {
  type = string
}

variable "public_subnet_b_cidr" {
  type = string
}

variable "private_subnet_a_cidr" {
  type = string
}

variable "private_subnet_b_cidr" {
  type = string
}

variable "cluster_name" {
  type = string
}
```

### Network 모듈 사용

network 모듈을 구성했으면 이제 사용할 차례입니다. 

이전 테라폼 백엔드를 선언했던 `main.tf` 파일에서 네트워크 모듈을 사용해줍니다.

`variable.tf` 파일에 선언되어있는 변수들에 값을 전부 넣어주어야 합니다.

```bash
locals {
  name              = "data-team-infra"
  region            = "ap-northeast-2"
  availability_zone = "ap-northeast-2a"
  k8s_cluster_name  = "cluster"
  tags = {
    Owner       = "aib"
    Environment = "dev"
  }
}

module "aws-network" {
  source = "./network_module"

  name                  = local.name
  vpc_name              = "aib_eks_vpc"
  cluster_name          = local.k8s_cluster_name
  aws_region            = local.region
  main_vpc_cidr         = "10.10.0.0/16"
  public_subnet_a_cidr  = "10.10.0.0/18"
  public_subnet_b_cidr  = "10.10.64.0/18"
  private_subnet_a_cidr = "10.10.128.0/18"
  private_subnet_b_cidr = "10.10.192.0/18"
}
```

다른 모듈들에서도 공통으로 사용할 값들에 대해서 로컬 변수로 지정해줍니다.

이후 `network_module` 모듈을 사용합니다.

`source` 에는 위에서 생성했던 `network_module` 의 위치를 입력해줍니다.

각 서브넷의 CIDR를 입력해줍니다. 

### 마무리

전부 입력후 테라폼 명령어를 통해 포멧팅부터 plan까지 진행합니다.

```bash
terraform fmt .
terraform init
terraform validate
terraform plan
```

문제없이 실행되는 것을 확인한 후 apply 해줍니다

```bash
terraform apply
```

테라폼이 실행된 후 VPC가 성공적으로 생성되었는지 테스트할 수 있습니다.
```bash
aws ec2 describe-vpcs --filters Name=cidr,Values=10.10.0.0/16
```
