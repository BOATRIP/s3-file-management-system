# cti-management-system

```
sequelize model:create --name table_name --attributes "column_name:column_type"
```

# Amazon Connect新環境を作る際の手順
- Elastic Beanstalk
    - 新規
        - 下記コマンドを実行
        ```
        eb create -db -i t2.medium --elb-type application
        ```
    - 既存環境からコピー
        - Elastic Beanstalkのメニューから環境のコピーを行う
    - 共通作業
        - DBのデフォルト文字コードが「Latin」なので「utf8mb4」に変更
            - パラメータグループに「japanese-language-params」が存在しない場合は、下記値のパラメータグループを作成し、DBの変更ボタンを押下し、「japanese-language-params」に紐付ける。
            ```
            character_set_client:utf8mb4
            character_set_connection:utf8mb4
            character_set_database:utf8mb4
            character_set_results:utf8mb4
            character_set_server:utf8mb4
            innodb_large_prefix:1
            innodb_file_format:Barracuda
            innodb_file_per_table:1
            ```
            - パラメータグループに「japanese-language-params」が存在する場合は、DBの変更ボタンを押下し、「japanese-language-params」に紐付ける。
        - 「Amazon Connect管理者ログイン後」作業が完了したら「プロジェクトルート/config/cti/environment」にその環境用のjsファイルを定義し、「環境固有の情報を記載する」
- Route 53
    - Elastic Beanstalkで建てた環境に「Aレコード」のエイリアスを設定する
- Lambda
    - registration-cti-contact-for-hogeを登録
    - translation-cti-file-for-hogeを登録
- Amazon Connect
    - Amazon Connect管理者ログイン前
        - アプリケーション統合
        - 問い合わせフローの「AWS Lambda」に「registration-cti-contact-for-hoge」を登録
    - Amazon Connect管理者ログイン後
        - 電話番号取得
        - キュー作成
        - ルーティングプロファイル作成
        - 問い合わせフロー作成
        - 既存お問い合わせフロー「Default customer queue」の英語音声を削除
- S3
    - Amazon Connectで自動作成され通話記録が保存されるS3に下記コードをアクセス権限に設定する
    
     ```$json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "DelegateS3Access",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "${ACCOUNT_ID}"
                },
                "Action": [
                    "s3:Get*",
                    "s3:List*"
                ],
                "Resource": [
                    "arn:aws:s3:::${S3_BUCKET_NAME}/*",
                    "arn:aws:s3:::${S3_BUCKET_NAME}"
                ]
            }
        ]
    }
    ```