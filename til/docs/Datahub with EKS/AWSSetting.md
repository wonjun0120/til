---
id: aws_setting
title: EKS Datahub 1 AWS Setting
sidebar_position: 1
tags:
    - AWS
    - EKS
    - Terraform
    - Datahub with EKS
---

# EKS - Datahub - 1 AWS Setting

Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik

### AWS IAM 설정

EKS를 관리할 AWS 계정을 새로 하나 만들어주었다.
EKS를 관리할 하나의 AWS 사용자가 필요합니다. 여기서는 이미 생성되어있는 terraform-user를 사용하였습니다.
사용자에 권한을 직접 줄 수 있는 권한이 한정되어있으므로, 그룹을 생성하여 권한을 관리합니다. 

Ops-Accounts라는 그룹을 만들어 EKS를 테라폼으로 관리할 수 있도록 권한을 부여합니다.
부여한 권한은 다음과 같습니다.

- AmazonEC2FullAccess
- IAMFullAccess
- AmazonEKSClusterPolicy
- AmazonEC2ContainerRegistryFullAccess
- AmazonS3FullAccess
- AmazonVPCFullAccess
- AmazonEKSServicePolicy
- AmazonRoute53FullAccess

EKS의 nodegroup을 생성하고, 삭제할 수 있는 권한과 Cluster들의 목록을 받아오고, 생성할 수 있는 권한이 필요합니다. 그런 권한들을 정책으로 모아 EKS-Management라는 권한 정책으로 만들어주었습니다.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "eks:DescribeNodegroup",
                "eks:DeleteNodegroup",
                "eks:UpdateNodegroupConfig",
                "eks:ListClusters",
                "eks:CreateCluster"
            ],
            "Resource": "*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "eks:*",
            "Resource": "arn:aws:eks:*:*:cluster/*"
        }
    ]
}
```

JSON을 사용하여 EKS-Management 권한 정책을 만들어주시면 됩니다.

역시 만든 권한을 Ops-Accounts라는 그룹에 부여해주었습니다.

생성한 Ops-Accounts그룹에 terraform-user를 포함시켜주었습니다. 
이제 terraform-user를 통해 eks를 terraform으로 관리할 수 있습니다.

![IAM생성후 이미지](https://user-images.githubusercontent.com/38996611/149649904-c95cb20c-0c8e-4233-8b4a-4de8b40d58a7.png)

생성된 Ops-Accounts 그룹입니다

### AWS-CLI

terraform을 사용하여 aws에 접근하기 위해서는 AWS-CLI를 사용해야합니다. 

AWS-CLI가 로컬에 설치되어있지 않다면 아래 북마크를 확인하여 설치해주시면 됩니다.

[macOS에서 AWS CLI 버전 2 설치, 업데이트 및 제거](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/install-cliv2-mac.html)

AWS-CLI를 설치해주었다면 이제 AWS-CLI에 IAM을 등록해야합니다. 

위에서 설정했던 terraform-user를 등록해줍니다.

아래 명령어를 입력하면 AWS-CLI에 IAM을 등록할 수 있습니다.

```python
aws configure --profile terraform-user
```

명령어를 입력한다면 아래와 같은 입력창들이 나오게 됩니다. 

주석을 확인하여 알맞는 값을 넣어주세요.

```bash
AWS Access Key ID [None]: # Access ID 입력
AWS Secret Access Key [None]: # Access Key 입력
Default region name [None]: ap-northeast-2 # 한국 리전 사용
Default output format [None]: json # 출력 포멧은 json 형식 사용
```

IAM이 제대로 등록이 되었는지 한 번 확인해보기 위해 아래 명령어를 한 번 입력해주세요.

```bash
aws configure list
```

명령을 사용하여 생성한 인증정보의 리스트를 확인할 수 있습니다.

profile에 terraform-user가 나오지 않는다면 다시 profile을 생성해주세요.

여기까지 진행하였다면 AWS-CLI에 terraform-user IAM을 통해 AWS 인프라를 CLI로 관리할 수 있습니다.

AWS-CLI로 제일 먼저 할 것은 테라폼 상태관리를 위한 S3 버킷 생성입니다. ([테라폼 백엔드에 대한 레퍼런스](https://honglab.tistory.com/117))

아래 명령어를 통해 CLI로 `aib-eks-states` 라는 이름의 S3버킷을 생성해주겠습니다.

리전은  `ap-northeast-2` 서울 리전을 사용합니다.

```bash
aws s3api create-bucket --bucket aib-eks-states \ 
--region ap-northeast-2 --create-bucket-configuration \ 
LocationConstraint=ap-northeast-2
```

✋잠깐! 여기서 AWS-CLI를 실행했을 때 `The config profile (default) could not be found` 에러가 발생하는 경우 환경변수로 Default Profile을 지정해주어야합니다.

```bash
export AWS_DEFAULT_PROFILE={profile_name}
```

위 명령어를 통해서 환경변수로 Default Profile을 지정해줄 수 있습니다.

여기서는 terraform-user를 사용하기 때문에 아래 명령어를 입력해주면 됩니다.

```bash
export AWS_DEFAULT_PROFILE=terraform-user
```

성공적으로 S3가 생성이 되었다면 실행에 대한 결과값으로 생성된 S3의 링크가 나오게 됩니다.

```bash
{
    "Location": "http://aib-eks-states.s3.amazonaws.com/"
}
```

여기까지 진행하였다면 이제 Terraform 코드 작성으로 넘어가면 됩니다.