const s3Service = require('../service/s3Service');

/**
 * プロフィール更新画面描画
 * @param req
 * @param res
 */
exports.viewFileList = async (req, res) => {
    const user = req.session.user;

    res.render('s3_file.ejs', {
        error: req.flash("error"),
        success: req.flash("success"),
        params: {
            title: 'S3ファイル',
            role: user.role,
            name: user.name,
        }
    });
};

/**
 * ファイルリスト取得
 * @param req
 * @param res
 */
exports.fetchFileList = async (req, res) => {
    try {
        const params = req.params;
        const path = (params === undefined) ? '' : params.path;
        const result = await s3Service.fetchObjectList(path);
        const fileList = {
            folders: result.CommonPrefixes.map(commonPrefix => commonPrefix.Prefix),
            files: result.Contents.map(content => content),
        }

        res.json({
            code: 200,
            fileList: fileList,
        });
    } catch (e) {
        console.error(e.message);
        res.json({
            code: 500,
            message: 'ファイルリストの取得に失敗しました。',
        });
    }
};
