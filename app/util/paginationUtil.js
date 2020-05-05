const {PAGINATION_CONSTS} = require('../consts/paginationConsts');

/**
 * ページネーション系Util
 * @type {DateUtil}
 */
module.exports.PaginationUtil = class PaginationUtil {
    /**
     * 現在ページ最適化
     * @param {String} page
     * @return {number}
     */
    static parseCurrentPage(page) {
        try {
            if (!page) return PAGINATION_CONSTS.DEFAULT_PAGE;

            const maybeNum = Number(page);
            return (Number.isNaN(maybeNum)) ? PAGINATION_CONSTS.DEFAULT_PAGE : maybeNum;
        } catch (e) {
            console.error(page, e.stack);
            return PAGINATION_CONSTS.DEFAULT_PAGE;
        }
    }

    /**
     * 現在ページ最適化
     * @param {Number} maxPage
     * @param {Number} currentPage
     * @return {Number}
     */
    static optimizeCurrentPage(maxPage, currentPage) {
        return (currentPage > maxPage) ? maxPage : currentPage;
    }

    /**
     * オフセット取得
     * @param {Number} currentPage
     * @return {Number} オフセット
     */
    static calcOffset(currentPage) {
        return (currentPage - 1) * PAGINATION_CONSTS.LIMIT;
    }

    /**
     * 総ページ数取得
     * @param {Number} counts
     * @return {Number} 総ページ数
     */
    static calcMaxPage(counts) {
        // 総件数がLimit未満の場合
        const divNum = Math.floor(counts / PAGINATION_CONSTS.LIMIT);
        if (divNum === 0) return divNum + 1;

        // 総件数で余りが発生する場合
        return ((counts % PAGINATION_CONSTS.LIMIT) > 0) ? divNum + 1 : divNum;
    }
}
;