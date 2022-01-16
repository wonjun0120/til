---
id: argocd_deploy
title: EKS Datahub 6 ArgoCD로 Datahub 배포
sidebar_position: 6
tags:
    - AWS
    - EKS
    - ArgoCD
    - GitOps
    - Terraform
    - Datahub with EKS
---

# EKS - Datahub - 6 ArgoCD로 Datahub 배포

Tags: aib-datateam, aws, datahub, eks, engineering-log, kubernetes, terraform, traefik

### 들어가기 전

이전 글에서 Argo CD를 EKS에 테라폼을 이용하여 설치했습니다.

이번 글에서는 Argo CD에 접속하여 EKS에 애플리케이션을 배포해보려합니다.

배포할 애플리케이션은 Datahub 입니다.

배포를 진행하기 전 Datahub를 Kubernetes로 배포하는 방법에 대한 공식문서를 한 번 확인하고 오시는 것을 추천드립니다

[Deploying with Kubernetes | DataHub](https://datahubproject.io/docs/deploy/kubernetes)

### Argo CD 접속

Argo CD에 접속해보겠습니다. 

먼저 Argo CD가 실행중인지 확인을 해야합니다. 

Argo CD를 설치한 네임스페이스에서 어떤 서비스가 실행중인지 한 번 확인해보겠습니다

```bash
kubectl get svc -n argocd
```

혹시나 `argocd` 가 아닌 다른 네임스페이스라면 

```bash
kubectl get svc -n {namespace}
```

`{namespace}` 자리에 네임스페이스를 입력해주세요.

명령어를 통해 서비스를 확인해봤을 때 

```bash
NAME                                    TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)             AGE
aib-eks-argocd-application-controller   ClusterIP   172.20.146.199   <none>        8082/TCP            18d
aib-eks-argocd-dex-server               ClusterIP   172.20.29.58     <none>        5556/TCP,5557/TCP   18d
aib-eks-argocd-redis                    ClusterIP   172.20.61.152    <none>        6379/TCP            18d
aib-eks-argocd-repo-server              ClusterIP   172.20.104.51    <none>        8081/TCP            18d
aib-eks-argocd-server                   ClusterIP   172.20.154.14    <none>        80/TCP,443/TCP      18d
```

이렇게 나온다면 Argo CD가 실행중인 것을 확인할 수 있습니다.

여기서 접속해야하는 것은 `argocd-server` 입니다.

다만 `argocd-server` 서비스에 `EXTERNAL-IP` 가 정의되어있지 않고, 쿠버네티스에서 Ingress를 정의해주지 않았기 때문에 지금 바로 인터넷에서 접속할 수 없습니다.

쿠버네티스 External-IP

[외부 IP 주소를 노출하여 클러스터의 애플리케이션에 접속하기](https://kubernetes.io/ko/docs/tutorials/stateless-application/expose-external-ip-address/)

 쿠버네티스 

[인그레스(Ingress)](https://kubernetes.io/ko/docs/concepts/services-networking/ingress/)

다른 설정없이 바로 접속할 수 있도록 `port-forward` 를 사용합니다.

[포트 포워딩을 사용해서 클러스터 내 애플리케이션에 접근하기](https://kubernetes.io/ko/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)

```bash
kubectl port-forward svc/aib-eks-argocd-server 8443:443 -n "argocd"
```

이렇게 명령어를 통해서 접속할 수 있습니다.

```bash
kubectl port-forward svc/{접속할_서비스_이름} {로컬에서_사용할_포트}:{서비스포트} -n "{네임스페이스}"
```

명령어를 실행하면 이렇게 나오게 됩니다.

![스크린샷_2022-01-11_오후_6 06 05](https://user-images.githubusercontent.com/38996611/149650601-95992e97-5da7-4176-950d-3430654f70ed.png)

이제 로컬에서 해당 서비스를 접속할 수 있습니다.

`[localhost:8443](http://localhost:8443)` 주소로 들어가면 Argo CD에 접속할 수 있습니다.

### Argo CD 로그인

Argo CD를 처음 실행하면 관리자 ID, 비밀번호가 이미 설정되어있습니다.

관리자 ID는 `admin` 입니다.

비밀번호는 Argo CD를 새로 설치할 때마다 달라지며, 제일 처음에는 비밀번호를 찾아야합니다.

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

위 명령을 통해 비밀번호를 찾을 수 있습니다.

비밀번호를 찾고 Argo CD에 접속해주세요.

### Argo CD로 Datahub 배포하기

이제 Argo CD에 들어왔으니 배포를 진행할 차례입니다.

Datahub Kubernetes 배포 공식 문서를 참고하며 배포를 진행하면 됩니다

[Deploying with Kubernetes | DataHub](https://datahubproject.io/docs/deploy/kubernetes)

배포 진행 전 datahub를 설치할 네임스페이스 생성이 필요합니다.

```bash
kubectl create namespace datahub
```

Datahub를 설치하기 위해서는 **prerequisites**를 설치해야합니다

먼저 `NEW APP` 을 클릭해줍니다.

**GENERAL**

`Application Name` : prerequisites

`Project` : default (Project 설정을 했다면 설정한 프로젝트 사용)

**SOURCE**

`Repository URL` : [https://helm.datahubproject.io/](https://helm.datahubproject.io/) 

`GIT`대신 `HELM` 선택

`Chart` : datahub-prerequisites

버전은 최신 버전 사용

**DESTINATION**

`Cluster URL` : https://kubernetes.default.svc

URL 유지

`Namespace` : datahub

**Helm**

`VALUES` : 여기서 values를 새로 작성할 수 있습니다. 

원본 values파일을 바탕으로 필요한 값을 변경하여 사용할 수 있습니다.

원본 values파일은 datahub-helm 레포에서 확인할 수 있습니다.

https://github.com/acryldata/datahub-helm

[datahub-helm/values.yaml at master · acryldata/datahub-helm](https://github.com/acryldata/datahub-helm/blob/master/charts/prerequisites/values.yaml)

```yaml
# Default configuration for pre-requisites to get you started
# Copy this file and update to the configuration of choice
elasticsearch:
  enabled: true   # set this to false, if you want to provide your own ES instance.
  replicas: 1
  minimumMasterNodes: 1
  # clusterHealthCheckParams: "wait_for_status=yellow&timeout=1s"
  # Set replicas to 1 and uncomment this to allow the instance to be scheduled on
  # a master node when deploying on a single node Minikube / Kind / etc cluster.
  antiAffinity: "soft"

  # # Shrink default JVM heap.
  # esJavaOpts: "-Xmx128m -Xms128m"

  # # Allocate smaller chunks of memory per pod.
  resources:
    requests:
      cpu: "100m"
      memory: "512M"
    limits:
      cpu: "1"
      memory: "2Gi"

# Official neo4j chart uses the Neo4j Enterprise Edition which requires a license
neo4j:
  enabled: false  # set this to true, if you have a license for the enterprise edition
  acceptLicenseAgreement: "yes"
  defaultDatabase: "graph.db"
  neo4jPassword: "datahub"
  # For better security, add password to neo4j-secrets k8s secret and uncomment below
  # existingPasswordSecret: neo4j-secrets
  core:
    standalone: true

# Deploys neo4j community version. Only supports single node
neo4j-community:
  enabled: true   # set this to false, if you have a license for the enterprise edition
  acceptLicenseAgreement: "yes"
  defaultDatabase: "graph.db"
  # For better security, add password to neo4j-secrets k8s secret and uncomment below
  existingPasswordSecret: neo4j-secrets

mysql:
  enabled: true
  auth:
    # For better security, add mysql-secrets k8s secret with mysql-root-password, mysql-replication-password and mysql-password
    existingSecret: mysql-secrets

cp-helm-charts:
  # Schema registry is under the community license
  cp-schema-registry:
    enabled: true
    kafka:
      bootstrapServers: "prerequisites-kafka:9092"  # <<release-name>>-kafka:9092
  cp-kafka:
    enabled: false
  cp-zookeeper:
    enabled: false
  cp-kafka-rest:
    enabled: false
  cp-kafka-connect:
    enabled: false
  cp-ksql-server:
    enabled: false
  cp-control-center:
    enabled: false

# Bitnami version of Kafka that deploys open source Kafka https://artifacthub.io/packages/helm/bitnami/kafka
kafka:
  enabled: true
```

elastic search의 `replicas`를 1로 변경해줍니다. 너무 많으면 파드의 갯수가 많아져 사용하는 리소스가 늘어나고, 에러가 발생하게 됩니다.

`resourecs` 에서 한도를 늘려줍니다. 

이렇게 prerequisites의 설정을 마무리하고 생성을 클릭해줍니다.

생성된 애플리케이션을 클릭하여 들어가면 해당 애플리케이션을 실행하기 위한 많은 서비스들을 볼 수 있습니다.

위에서 `SYNC` 를 클릭하고 `SYNCHRONIZE` 를 클릭해주면 레포의 코드를 통해 쿠버네티스 내부에 서비스들을 실행시킬 수 있습니다.

아래 사진처럼 `Healthy` , `Synced` , `Sync OK` 가 나오면 성공한 것입니다.

![스크린샷_2022-01-11_오후_6 28 59](https://user-images.githubusercontent.com/38996611/149650602-23e7f3fe-6a47-44e5-b426-8765de8b96ef.png")
 
만약 에러가 발생한 부분이 있다면 그 부분을 클릭하여 `EVENT` 나 `LOG` 를 확인할 수 있습니다.

- prerequisites 애플리케이션 실행 사진
    
![스크린샷_2022-01-11_오후_6 30 42](https://user-images.githubusercontent.com/38996611/149650604-b5b7dc40-195b-4aa9-8cd8-197f64340954.png")

까마득하다..
    

이제 Datahub를 생성해주면 됩니다.

아까와 같이 `NEW APP`을 클릭하여 새로운 애플리케이션을 만들어줍니다.

**GENERAL**

`Application Name` : datahub

`Project` : default (Project 설정을 했다면 설정한 프로젝트 사용)

**SOURCE**

`Repository URL` : [https://helm.datahubproject.io/](https://helm.datahubproject.io/) 

`GIT`대신 `HELM` 선택

`Chart` : datahub

버전은 최신 버전 사용

**DESTINATION**

`Cluster URL` : https://kubernetes.default.svc

URL 유지

`Namespace` : datahub

여기서는 따로 values파일을 변경해주지 않았습니다.

애플리케이션 생성 후 `SYNC` 를 클릭하고 `SYNCHRONIZE` 를 클릭하여 애플리케이션을 실행하였습니다.

이렇게 Datahub를 EKS에 배포할 수 있습니다.

![스크린샷_2022-01-11_오후_6 34 45](https://user-images.githubusercontent.com/38996611/149650605-3c4ef527-d56b-4273-958e-d85edde0fd2f.png)

Argo CD의 Applications에서 각 애플리케이션의 상태를 확인할 수 있습니다.

![스크린샷_2022-01-11_오후_6 35 36](https://user-images.githubusercontent.com/38996611/149650608-ff81843f-032d-4608-a119-47ac36acc230.png)

Applications가 `Healthy`가 아니라면 해당 애플리케이션에 문제가 있음을 나타냅니다.

### Datahub 접속

datahub에 접속해보기 위해 datahub 네임스페이스에서 실행중인 서비스를 확인해봅니다.

```bash
kubectl get svc -n datahub
```

그럼 이것과 비슷한 결과가 나옵니다

```bash
NAME                               TYPE           CLUSTER-IP       EXTERNAL-IP                                                                   PORT(S)                      AGE
datahub-datahub-frontend           LoadBalancer   172.20.249.228   a88dc81a8596b4e589ee30883a6201b1-324580445.ap-northeast-2.elb.amazonaws.com   9002:32100/TCP               18d
datahub-datahub-gms                LoadBalancer   172.20.203.41    a9ccfa41873e240e699192dd64799476-746239269.ap-northeast-2.elb.amazonaws.com   8080:31643/TCP               18d
elasticsearch-master               ClusterIP      172.20.180.16    <none>                                                                        9200/TCP,9300/TCP            18d
elasticsearch-master-headless      ClusterIP      None             <none>                                                                        9200/TCP,9300/TCP            18d
prerequisites-cp-schema-registry   ClusterIP      172.20.113.147   <none>                                                                        8081/TCP,5556/TCP            18d
prerequisites-kafka                ClusterIP      172.20.17.48     <none>                                                                        9092/TCP                     18d
prerequisites-kafka-headless       ClusterIP      None             <none>                                                                        9092/TCP,9093/TCP            18d
prerequisites-mysql                ClusterIP      172.20.207.132   <none>                                                                        3306/TCP                     18d
prerequisites-mysql-headless       ClusterIP      None             <none>                                                                        3306/TCP                     18d
prerequisites-neo4j-community      ClusterIP      None             <none>                                                                        7474/TCP,7687/TCP            18d
prerequisites-zookeeper            ClusterIP      172.20.60.209    <none>                                                                        2181/TCP,2888/TCP,3888/TCP   18d
prerequisites-zookeeper-headless   ClusterIP      None             <none>                                                                        2181/TCP,2888/TCP,3888/TCP   18d
```

Datahub에 접속하기 위해서는 `datahub-datahub-frontend` 에 접속해야합니다.

해당 서비스에는 `EXTERNAL-IP` 가 정의되어있기 때문에 해당 주소로 접속해주면 됩니다. 

이렇게 Datahub를 EKS에 배포할 수 있었습니다.
