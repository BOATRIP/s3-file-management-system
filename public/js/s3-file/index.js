/**
 * 初期処理
 */
$(async () => {
    /**
     * ファイルリスト取得
     * @param {String} path
     * @private
     */
    const _fetchFileList = async (path) => {
        const resultArea = $('#result-message');
        resultArea.html('');

        const result = await $.ajax({
            type: 'GET',
            url: `/s3files/lists/${path}`
        }).catch(error => {
            console.error(error.message);
        });
        if (result.code !== 200) {    // サーバが失敗を返した場合
            console.error('取得に失敗しました。');
        }
        return result.fileList;
    };

    const _writeHtml = async (fileList) => {
        $('#fileList').html('');

        fileList['folders'].forEach(folder => {
            $('#fileList').append(`
                <tr>
                <td>
                </td>
                <td>
                <i class="icon-folder icons mt-4"></i>
                </td>
                <td>
                <label class="form-check-label">${folder}</label>
            </div>
            </td>
            <td>--</td>
            <td>--</td>
            </tr>
            `);
        });

        fileList['files'].forEach(file => {
            $('#fileList').append(`
                <tr>
                <td>
                <div class="form-check checkbox">
                <input class="form-check-input" id="check_${file.Key}" type="checkbox"
            value="">
                </div>
                </td>
                <td>
                <i class="icon-doc icons mt-4"></i>
                </td>
                <td>
                <label class="form-check-label">${file.Key}</label>
            </td>
            <td>${file.LastModified}</td>
            <td>${file.Size}バイト</td>
            </tr>
            `);
        });
    };

    const fileList = await _fetchFileList('');
    await _writeHtml(fileList)

    // // 更新ボタン押下時のイベントを設定
    // $('.fa.fa-edit').click(function () {
    //     const row = $(this).closest("tr");
    //     const id = row.find('[name=triggerId]').val();
    //     const word = row.find('input[name=triggerWord]').val();
    //     const type = row.find('[name=triggerType] option:selected').val();
    //     const color = row.find('[name=color] option:selected').val();
    //     const isDeleted = row.find('#isDeleted:checked').val() === 'on';
    //     _upsertTriggerWord({
    //         id: id,
    //         word: word,
    //         type: type,
    //         color: color,
    //         isDeleted: isDeleted
    //     });
    // });

    // // +ボタン押下時のイベントを設定
    // $('.fa.icon-plus').click(function () {
    //     const row = $(this).closest("tr");
    //     const newRow = row.clone(true);
    //     newRow.find('[name=triggerId]').val('');
    //     newRow.find('input[name=triggerWord]').val('');
    //     newRow.insertAfter(row);
    // });
});