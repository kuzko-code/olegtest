const closeAllMenu = () => {
    let menus = document.querySelectorAll('.showSubmenu');
    menus.forEach(menu => {
        menu.classList.remove('active');
    })
}
const closeSearchForm = () => {
    classList(document.getElementById('searchToggle')).remove('active');
}



export {
    closeAllMenu,
    closeSearchForm
}