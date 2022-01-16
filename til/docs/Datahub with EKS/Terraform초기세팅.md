---
id: terraform_basic_setting
title: EKS Datahub 2 Terraform 초기 세팅
sidebar_position: 2
tags:
    - AWS
    - EKS
    - Terraform
    - Datahub with EKS
---

# EKS - Datahub - 2 Terraform 초기 세팅

Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik

### 작업할 레포 생성

aib-eks-terraform 레포를 생성해주었습니다. 

해당 레포에서 EKS의 환경을 관리하는 Terraform 코드를 관리하려합니다. 

### Terraform 세팅

테라폼을 사용하여 본격적으로 EKS를 관리해주려고 합니다. 

그 전에 Terraform의 기본 세팅이 필요합니다.

테라폼이 로컬에 설치되어있지 않다면 먼저 설치를 진행해줍니다. 

[테라폼(Terraform) 기초 튜토리얼: AWS로 시작하는 Infrastructure as Code](https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code)

테라폼 기초 튜토리얼 레퍼런스 입니다. 
테라폼을 처음 사용하는 경우 한 번 참고하시는 것을 추천드립니다.

테라폼을 설치해주었다면 이제 본격적으로 테라폼 코드를 작성합니다. 

테라폼이 실행되는 파일인 `[main.tf](http://main.tf)` 파일을 생성해줍니다. 

해당 파일에서 관리되어야하는 인프라 코드들이 총 집합할 예정입니다.

### Terraform 초기 코드 작성

테라폼 코드 작성 초기에는 테라폼의 상태(state)를 저장할 backend를 지정해주는 코드 작성이 필요합니다.

backend는 이전에 생성한 S3 `aib-eks-states` 버킷을 사용합니다. 

테라폼에서 상태는 매우 중요합니다. 

테라폼으로 작성된 인프라가 어떤 상태인지 저장을 통해 테라폼 코드가 변경이 되면 상태와 변경된 테라폼 코드를 비교하여 인프라를 변경하기 때문입니다. 

테라폼 상태 레퍼런스입니다

[State | Terraform by HashiCorp](https://www.terraform.io/language/state)

테라폼 코드를 다 같이 작업하는 경우 서로 다른 로컬에서 하나의 상태를 동시에 수정하는 일이 발생할 수 있습니다. 상태가 매우 중요한 테라폼에서는 위험한 상황이며, 이를 방지하기 위해 상태 잠금을 구현해주었습니다. 

테라폼 상태 잠금 레퍼런스입니다. 

[State: Locking | Terraform by HashiCorp](https://www.terraform.io/language/state/locking)

AWS에서는 Dynamodb를 사용하여 이런 상태 잠금을 구현할 수 있습니다. 

Dynamodb를 사용한 테라폼 상태 잠금 레퍼런스입니다.

[Terraform state locking using DynamoDB](https://stackoverflow.com/questions/43209940/terraform-state-locking-using-dynamodb)

레퍼런스들을 바탕으로 코드를 작성하면 아래와 같이 작성됩니다. 

```HCL
terraform {
  backend "s3" {
    bucket         = "aib-eks-states"
    key            = "terraform-env"
    region         = "ap-northeast-2"
    dynamodb_table = "eks-terraform-state"

    profile                 = "terraform-user"
    shared_credentials_file = "~/.aws/credentials"
  }
}

provider "aws" {
  region  = "ap-northeast-2"
  profile = "terraform-user"
}

resource "aws_dynamodb_table" "eks-terraform-state" {
  name           = "eks-terraform-state"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

테라폼 코드를 작성했다면 코드를 보기 좋게 포멧팅하고, 공급자를 설치하고, 해당 코드가 유효한지 확인하고, 모의 테스트를 진행해볼 수 있습니다. 

먼저 **코드 포멧팅**입니다. 

```bash
terraform fmt {파일명 or 파일 위치}
```

위 명령을 통해 작성한 코드를 포멧팅할 수 있습니다. 

`main.tf`파일만 생성했기 때문에 `main.tf` 파일만 포멧팅해보겠습니다.

```bash
terraform fmt main.tf
```

이 명령어를 통해 테라폼 파일(HCL파일)을 검사하고, 일관성과 가독성을 높일 수 있도록 포멧팅을 할 수 있습니다.

저 명령어를 통해 변경된 파일이 있다면 명령어 실행 후에 변경된 파일 이름을 출력합니다. 

다음은 공급자를 설치해야합니다. 

공급자란 테라폼과 외부 서비스를 연결해주는 모듈입니다. 

여기서는 테라폼을 사용하여 AWS의 인프라를 관리해주기 때문에 AWS 공급자를 사용합니다. 

코드에서는 `provider` 를 통해 공급자를 선언할 수 있습니다.

공급자를 설치해야 테라폼 코드 실행을 해볼 수 있습니다.

```bash
terraform init
```

이 명령어를 통해 테라폼의 공급자를 설치할 수 있습니다. 

공급자 설치까지 진행이 되었다면 다음은 유효성 검사입니다. 

작성한 테라폼 코드에 구문오류가 있는지 확인해볼 수 있습니다. 

```bash
terraform validate
```

이 명령어를 통해 작성한 테라폼 코드의 유효성 검사를 진행할 수 있습니다.

유효성 검사가 통과되었다면 아래 사진처럼 Success! 라는 문구가 나오게 됩니다.

![terraform_validate_success](https://user-images.githubusercontent.com/38996611/149650307-10dd9452-f561-457a-9b2e-c843dc238cbb.png)


유효성 검사를 한 뒤에는 이제 작성된, 혹은 변경된 테라폼 코드를 적용하였을 때 
인프라의 어떤 것들이 변경되는지, 테스트해볼 수 있습니다.

백엔드에 있는 상태 파일과 현재 테라폼 코드를 비교하여 변경될 값들만 보여줄 뿐 
실제로 변경되지는 않습니다. 

```bash
terraform plan
```

이 명령어를 실행하면 현재 상태에서 어떤 것들이 변경되는지 확인할 수 있습니다. 

이렇게 4단계를 통해 작성한 테라폼 코드를 개발하면서 테스트할 수 있습니다. 

만약 작성된 테라폼 코드를 적용해야하는 경우 

```bash
terraform apply
```

명령어를 통해 작성한 테라폼 코드를 적용할 수 있습니다. 

작성한 코드를 깃허브로 올리기 전에 올라가지 않아도 되는, 올라가면 안되는 파일들을 `.gitignore` 파일로 관리해야합니다.

terraform 코드의 `.gitignore` 파일은 github 레포생성시 terraform `.gitignore` 파일을 생성하거나 github에서 올려준 코드를 복사하여 사용합니다

[gitignore/Terraform.gitignore at main · github/gitignore](https://github.com/github/gitignore/blob/main/Terraform.gitignore)

이렇게 깃허브에서 관리할 수 있도록 기본적인 세팅을 마무리하였습니다.

이제 다음 글에서 테라폼을 통해 EKS를 생성해보겠습니다.