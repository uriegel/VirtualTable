import './VirtualTableComponent.js'

const themeChooser = document.getElementById("themeChooser")
const table = document.querySelector('virtual-table-component')

themeChooser.onchange = () => {
    const changeTheme = theme => {
        ["themeBlue", "themeAdwaita", "themeAdwaitaDark"].forEach(n => {
            document.body.classList.remove(n)    
            table.classList.remove(n)    
        })
        document.body.classList.add(theme)    
        table.classList.add(theme)    
    }

    switch (themeChooser.selectedIndex) {
        case 0: 
            changeTheme("themeBlue")
            break
        case 1: 
            changeTheme("themeAdwaita")
            break
        case 2: 
            changeTheme("themeAdwaitaDark")
        break
    }
}



table.setColumns([{
        name: "Name"
    }, {
        name: "Ext.",
    }, {
        name: "Datum"
    }, {
        name: "Größe"
    }]
)

// TODO: Themes with different font sizes
// TODO: Adaptable column widthes
// TODO: Sortable: highlighted, asc, desc
// TODO: SubColumn, sortable