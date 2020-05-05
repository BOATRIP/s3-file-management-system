/**
 * 更新ボタン押下時イベント
 */
$(() => {
    $('#client-update').on('click', () => {
        const resultArea = $('#result-message');
        resultArea.html('');

        const phone = $('#clientPhone').val();
        if (phone === '') {
            resultArea.html(`<div class="alert alert-danger">電話番号が入力されていません。</div>`);
            return;
        }

        const params = {
            name: $('#clientName').val(),
            sex: $('#clientSex').val(),
            memo: $('#clientMemo').val()
        };

        $.ajax({
            url: `/clients/edits/${phone}`,
            method: "PUT",
            dataType: 'json',
            data: JSON.stringify(params),
            cache: false,
            contentType: 'application/json',
            success: (json_data) => {   // 200 OK時
                // JSON Arrayの先頭が成功フラグ、失敗の場合2番目がエラーメッセージ
                if (json_data.code !== 200) {    // サーバが失敗を返した場合
                    resultArea.html(`<div class="alert alert-danger">${json_data.message}</div>`);
                    return;
                }
                resultArea.html(`<div class="alert alert-success">${json_data.message}</div>`)
            },
            error: () => {
                console.error("Server Error. Pleasy try again later.");
            }
        });
    });
})