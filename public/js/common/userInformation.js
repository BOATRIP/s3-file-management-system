/**
 * 権限別CSS定義
 * @type {{admin: string, operator: string}}
 */
const roleCssImage = {
    'operator': 'fa-headphones',
    'admin': 'fa-desktop',
};

/**
 * 即時実行
 */
(async () => {


    const result = await $.ajax('/users/informations', {method: 'GET'}).catch(error => {console.error(error.message)});
    const user = result.user;

    // 権限のアイコン・名称設定
    let roleCss;
    if (result.code !== 200) {
        console.error(result.message);
        roleCss = roleCssImage.operator;
    } else {
        roleCss = roleCssImage[user.role]
    }
    const userRoleClassArea = $('#userRoleClass');
    userRoleClassArea.addClass(roleCss);
    const userRoleNameArea = $('#userRoleName');
    userRoleNameArea.html(`${user.role} : ${user.name}`);
})();