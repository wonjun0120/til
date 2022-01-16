"use strict";(self.webpackChunktil=self.webpackChunktil||[]).push([[1163],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return k}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var i=a.createContext({}),u=function(e){var t=a.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,i=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=u(n),k=r,f=m["".concat(i,".").concat(k)]||m[k]||p[k]||l;return n?a.createElement(f,o(o({ref:t},c),{},{components:n})):a.createElement(f,o({ref:t},c))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var s={};for(var i in t)hasOwnProperty.call(t,i)&&(s[i]=t[i]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var u=2;u<l;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5913:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return i},metadata:function(){return u},toc:function(){return c},default:function(){return m}});var a=n(7462),r=n(3366),l=(n(7294),n(3905)),o=["components"],s={id:"aws_setting",title:"EKS Datahub 1 AWS Setting",sidebar_position:1,tags:["AWS","EKS","Terraform","Datahub with EKS"]},i="EKS - Datahub - 1 AWS Setting",u={unversionedId:"Datahub with EKS/aws_setting",id:"Datahub with EKS/aws_setting",title:"EKS Datahub 1 AWS Setting",description:"Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik",source:"@site/docs/Datahub with EKS/AWSSetting.md",sourceDirName:"Datahub with EKS",slug:"/Datahub with EKS/aws_setting",permalink:"/til/docs/Datahub with EKS/aws_setting",editUrl:"https://wonjun0120/github.io/til/docs/docs/Datahub with EKS/AWSSetting.md",tags:[{label:"AWS",permalink:"/til/docs/tags/aws"},{label:"EKS",permalink:"/til/docs/tags/eks"},{label:"Terraform",permalink:"/til/docs/tags/terraform"},{label:"Datahub with EKS",permalink:"/til/docs/tags/datahub-with-eks"}],version:"current",sidebarPosition:1,frontMatter:{id:"aws_setting",title:"EKS Datahub 1 AWS Setting",sidebar_position:1,tags:["AWS","EKS","Terraform","Datahub with EKS"]},sidebar:"tutorialSidebar",previous:{title:"Translate your site",permalink:"/til/docs/tutorial-extras/translate-your-site"},next:{title:"EKS Datahub 2 Terraform \ucd08\uae30 \uc138\ud305",permalink:"/til/docs/Datahub with EKS/terraform_basic_setting"}},c=[{value:"AWS IAM \uc124\uc815",id:"aws-iam-\uc124\uc815",children:[],level:3},{value:"AWS-CLI",id:"aws-cli",children:[],level:3}],p={toc:c};function m(e){var t=e.components,n=(0,r.Z)(e,o);return(0,l.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"eks---datahub---1-aws-setting"},"EKS - Datahub - 1 AWS Setting"),(0,l.kt)("p",null,"Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik"),(0,l.kt)("h3",{id:"aws-iam-\uc124\uc815"},"AWS IAM \uc124\uc815"),(0,l.kt)("p",null,"EKS\ub97c \uad00\ub9ac\ud560 AWS \uacc4\uc815\uc744 \uc0c8\ub85c \ud558\ub098 \ub9cc\ub4e4\uc5b4\uc8fc\uc5c8\ub2e4.\nEKS\ub97c \uad00\ub9ac\ud560 \ud558\ub098\uc758 AWS \uc0ac\uc6a9\uc790\uac00 \ud544\uc694\ud569\ub2c8\ub2e4. \uc5ec\uae30\uc11c\ub294 \uc774\ubbf8 \uc0dd\uc131\ub418\uc5b4\uc788\ub294 terraform-user\ub97c \uc0ac\uc6a9\ud558\uc600\uc2b5\ub2c8\ub2e4.\n\uc0ac\uc6a9\uc790\uc5d0 \uad8c\ud55c\uc744 \uc9c1\uc811 \uc904 \uc218 \uc788\ub294 \uad8c\ud55c\uc774 \ud55c\uc815\ub418\uc5b4\uc788\uc73c\ubbc0\ub85c, \uadf8\ub8f9\uc744 \uc0dd\uc131\ud558\uc5ec \uad8c\ud55c\uc744 \uad00\ub9ac\ud569\ub2c8\ub2e4. "),(0,l.kt)("p",null,"Ops-Accounts\ub77c\ub294 \uadf8\ub8f9\uc744 \ub9cc\ub4e4\uc5b4 EKS\ub97c \ud14c\ub77c\ud3fc\uc73c\ub85c \uad00\ub9ac\ud560 \uc218 \uc788\ub3c4\ub85d \uad8c\ud55c\uc744 \ubd80\uc5ec\ud569\ub2c8\ub2e4.\n\ubd80\uc5ec\ud55c \uad8c\ud55c\uc740 \ub2e4\uc74c\uacfc \uac19\uc2b5\ub2c8\ub2e4."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"AmazonEC2FullAccess"),(0,l.kt)("li",{parentName:"ul"},"IAMFullAccess"),(0,l.kt)("li",{parentName:"ul"},"AmazonEKSClusterPolicy"),(0,l.kt)("li",{parentName:"ul"},"AmazonEC2ContainerRegistryFullAccess"),(0,l.kt)("li",{parentName:"ul"},"AmazonS3FullAccess"),(0,l.kt)("li",{parentName:"ul"},"AmazonVPCFullAccess"),(0,l.kt)("li",{parentName:"ul"},"AmazonEKSServicePolicy"),(0,l.kt)("li",{parentName:"ul"},"AmazonRoute53FullAccess")),(0,l.kt)("p",null,"EKS\uc758 nodegroup\uc744 \uc0dd\uc131\ud558\uace0, \uc0ad\uc81c\ud560 \uc218 \uc788\ub294 \uad8c\ud55c\uacfc Cluster\ub4e4\uc758 \ubaa9\ub85d\uc744 \ubc1b\uc544\uc624\uace0, \uc0dd\uc131\ud560 \uc218 \uc788\ub294 \uad8c\ud55c\uc774 \ud544\uc694\ud569\ub2c8\ub2e4. \uadf8\ub7f0 \uad8c\ud55c\ub4e4\uc744 \uc815\ucc45\uc73c\ub85c \ubaa8\uc544 EKS-Management\ub77c\ub294 \uad8c\ud55c \uc815\ucc45\uc73c\ub85c \ub9cc\ub4e4\uc5b4\uc8fc\uc5c8\uc2b5\ub2c8\ub2e4."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "Version": "2012-10-17",\n    "Statement": [\n        {\n            "Sid": "VisualEditor0",\n            "Effect": "Allow",\n            "Action": [\n                "eks:DescribeNodegroup",\n                "eks:DeleteNodegroup",\n                "eks:UpdateNodegroupConfig",\n                "eks:ListClusters",\n                "eks:CreateCluster"\n            ],\n            "Resource": "*"\n        },\n        {\n            "Sid": "VisualEditor1",\n            "Effect": "Allow",\n            "Action": "eks:*",\n            "Resource": "arn:aws:eks:*:*:cluster/*"\n        }\n    ]\n}\n')),(0,l.kt)("p",null,"JSON\uc744 \uc0ac\uc6a9\ud558\uc5ec EKS-Management \uad8c\ud55c \uc815\ucc45\uc744 \ub9cc\ub4e4\uc5b4\uc8fc\uc2dc\uba74 \ub429\ub2c8\ub2e4."),(0,l.kt)("p",null,"\uc5ed\uc2dc \ub9cc\ub4e0 \uad8c\ud55c\uc744 Ops-Accounts\ub77c\ub294 \uadf8\ub8f9\uc5d0 \ubd80\uc5ec\ud574\uc8fc\uc5c8\uc2b5\ub2c8\ub2e4."),(0,l.kt)("p",null,"\uc0dd\uc131\ud55c Ops-Accounts\uadf8\ub8f9\uc5d0 terraform-user\ub97c \ud3ec\ud568\uc2dc\ucf1c\uc8fc\uc5c8\uc2b5\ub2c8\ub2e4.\n\uc774\uc81c terraform-user\ub97c \ud1b5\ud574 eks\ub97c terraform\uc73c\ub85c \uad00\ub9ac\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,l.kt)("p",null,(0,l.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/38996611/149649904-c95cb20c-0c8e-4233-8b4a-4de8b40d58a7.png",alt:"IAM\u1109\u1162\u11bc\u1109\u1165\u11bc\u1112\u116e \u110b\u1175\u1106\u1175\u110c\u1175"})),(0,l.kt)("p",null,"\uc0dd\uc131\ub41c Ops-Accounts \uadf8\ub8f9\uc785\ub2c8\ub2e4"),(0,l.kt)("h3",{id:"aws-cli"},"AWS-CLI"),(0,l.kt)("p",null,"terraform\uc744 \uc0ac\uc6a9\ud558\uc5ec aws\uc5d0 \uc811\uadfc\ud558\uae30 \uc704\ud574\uc11c\ub294 AWS-CLI\ub97c \uc0ac\uc6a9\ud574\uc57c\ud569\ub2c8\ub2e4. "),(0,l.kt)("p",null,"AWS-CLI\uac00 \ub85c\uceec\uc5d0 \uc124\uce58\ub418\uc5b4\uc788\uc9c0 \uc54a\ub2e4\uba74 \uc544\ub798 \ubd81\ub9c8\ud06c\ub97c \ud655\uc778\ud558\uc5ec \uc124\uce58\ud574\uc8fc\uc2dc\uba74 \ub429\ub2c8\ub2e4."),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/install-cliv2-mac.html"},"macOS\uc5d0\uc11c AWS CLI \ubc84\uc804 2 \uc124\uce58, \uc5c5\ub370\uc774\ud2b8 \ubc0f \uc81c\uac70")),(0,l.kt)("p",null,"AWS-CLI\ub97c \uc124\uce58\ud574\uc8fc\uc5c8\ub2e4\uba74 \uc774\uc81c AWS-CLI\uc5d0 IAM\uc744 \ub4f1\ub85d\ud574\uc57c\ud569\ub2c8\ub2e4. "),(0,l.kt)("p",null,"\uc704\uc5d0\uc11c \uc124\uc815\ud588\ub358 terraform-user\ub97c \ub4f1\ub85d\ud574\uc90d\ub2c8\ub2e4."),(0,l.kt)("p",null,"\uc544\ub798 \uba85\ub839\uc5b4\ub97c \uc785\ub825\ud558\uba74 AWS-CLI\uc5d0 IAM\uc744 \ub4f1\ub85d\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-python"},"aws configure --profile terraform-user\n")),(0,l.kt)("p",null,"\uba85\ub839\uc5b4\ub97c \uc785\ub825\ud55c\ub2e4\uba74 \uc544\ub798\uc640 \uac19\uc740 \uc785\ub825\ucc3d\ub4e4\uc774 \ub098\uc624\uac8c \ub429\ub2c8\ub2e4. "),(0,l.kt)("p",null,"\uc8fc\uc11d\uc744 \ud655\uc778\ud558\uc5ec \uc54c\ub9de\ub294 \uac12\uc744 \ub123\uc5b4\uc8fc\uc138\uc694."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"AWS Access Key ID [None]: # Access ID \uc785\ub825\nAWS Secret Access Key [None]: # Access Key \uc785\ub825\nDefault region name [None]: ap-northeast-2 # \ud55c\uad6d \ub9ac\uc804 \uc0ac\uc6a9\nDefault output format [None]: json # \ucd9c\ub825 \ud3ec\uba67\uc740 json \ud615\uc2dd \uc0ac\uc6a9\n")),(0,l.kt)("p",null,"IAM\uc774 \uc81c\ub300\ub85c \ub4f1\ub85d\uc774 \ub418\uc5c8\ub294\uc9c0 \ud55c \ubc88 \ud655\uc778\ud574\ubcf4\uae30 \uc704\ud574 \uc544\ub798 \uba85\ub839\uc5b4\ub97c \ud55c \ubc88 \uc785\ub825\ud574\uc8fc\uc138\uc694."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"aws configure list\n")),(0,l.kt)("p",null,"\uba85\ub839\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc0dd\uc131\ud55c \uc778\uc99d\uc815\ubcf4\uc758 \ub9ac\uc2a4\ud2b8\ub97c \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,l.kt)("p",null,"profile\uc5d0 terraform-user\uac00 \ub098\uc624\uc9c0 \uc54a\ub294\ub2e4\uba74 \ub2e4\uc2dc profile\uc744 \uc0dd\uc131\ud574\uc8fc\uc138\uc694."),(0,l.kt)("p",null,"\uc5ec\uae30\uae4c\uc9c0 \uc9c4\ud589\ud558\uc600\ub2e4\uba74 AWS-CLI\uc5d0 terraform-user IAM\uc744 \ud1b5\ud574 AWS \uc778\ud504\ub77c\ub97c CLI\ub85c \uad00\ub9ac\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,l.kt)("p",null,"AWS-CLI\ub85c \uc81c\uc77c \uba3c\uc800 \ud560 \uac83\uc740 \ud14c\ub77c\ud3fc \uc0c1\ud0dc\uad00\ub9ac\ub97c \uc704\ud55c S3 \ubc84\ud0b7 \uc0dd\uc131\uc785\ub2c8\ub2e4. (",(0,l.kt)("a",{parentName:"p",href:"https://honglab.tistory.com/117"},"\ud14c\ub77c\ud3fc \ubc31\uc5d4\ub4dc\uc5d0 \ub300\ud55c \ub808\ud37c\ub7f0\uc2a4"),")"),(0,l.kt)("p",null,"\uc544\ub798 \uba85\ub839\uc5b4\ub97c \ud1b5\ud574 CLI\ub85c ",(0,l.kt)("inlineCode",{parentName:"p"},"aib-eks-states")," \ub77c\ub294 \uc774\ub984\uc758 S3\ubc84\ud0b7\uc744 \uc0dd\uc131\ud574\uc8fc\uaca0\uc2b5\ub2c8\ub2e4."),(0,l.kt)("p",null,"\ub9ac\uc804\uc740  ",(0,l.kt)("inlineCode",{parentName:"p"},"ap-northeast-2")," \uc11c\uc6b8 \ub9ac\uc804\uc744 \uc0ac\uc6a9\ud569\ub2c8\ub2e4."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"aws s3api create-bucket --bucket aib-eks-states \\ \n--region ap-northeast-2 --create-bucket-configuration \\ \nLocationConstraint=ap-northeast-2\n")),(0,l.kt)("p",null,"\u270b\uc7a0\uae50!\xa0\uc5ec\uae30\uc11c AWS-CLI\ub97c \uc2e4\ud589\ud588\uc744 \ub54c ",(0,l.kt)("inlineCode",{parentName:"p"},"The config profile (default) could not be found")," \uc5d0\ub7ec\uac00 \ubc1c\uc0dd\ud558\ub294 \uacbd\uc6b0 \ud658\uacbd\ubcc0\uc218\ub85c Default Profile\uc744 \uc9c0\uc815\ud574\uc8fc\uc5b4\uc57c\ud569\ub2c8\ub2e4."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"export AWS_DEFAULT_PROFILE={profile_name}\n")),(0,l.kt)("p",null,"\uc704 \uba85\ub839\uc5b4\ub97c \ud1b5\ud574\uc11c \ud658\uacbd\ubcc0\uc218\ub85c Default Profile\uc744 \uc9c0\uc815\ud574\uc904 \uc218 \uc788\uc2b5\ub2c8\ub2e4."),(0,l.kt)("p",null,"\uc5ec\uae30\uc11c\ub294 terraform-user\ub97c \uc0ac\uc6a9\ud558\uae30 \ub54c\ubb38\uc5d0 \uc544\ub798 \uba85\ub839\uc5b4\ub97c \uc785\ub825\ud574\uc8fc\uba74 \ub429\ub2c8\ub2e4."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},"export AWS_DEFAULT_PROFILE=terraform-user\n")),(0,l.kt)("p",null,"\uc131\uacf5\uc801\uc73c\ub85c S3\uac00 \uc0dd\uc131\uc774 \ub418\uc5c8\ub2e4\uba74 \uc2e4\ud589\uc5d0 \ub300\ud55c \uacb0\uacfc\uac12\uc73c\ub85c \uc0dd\uc131\ub41c S3\uc758 \ub9c1\ud06c\uac00 \ub098\uc624\uac8c \ub429\ub2c8\ub2e4."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-bash"},'{\n    "Location": "http://aib-eks-states.s3.amazonaws.com/"\n}\n')),(0,l.kt)("p",null,"\uc5ec\uae30\uae4c\uc9c0 \uc9c4\ud589\ud558\uc600\ub2e4\uba74 \uc774\uc81c Terraform \ucf54\ub4dc \uc791\uc131\uc73c\ub85c \ub118\uc5b4\uac00\uba74 \ub429\ub2c8\ub2e4."))}m.isMDXComponent=!0}}]);