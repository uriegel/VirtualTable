import './VirtualTableComponent.js'

const themeChooser = document.getElementById("themeChooser")
const changeCols = document.getElementById("changeCols")
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

const widthstr = localStorage.getItem("widths")
const widths = widthstr ? JSON.parse(widthstr) : []
let columns = [{
    name: "Name"
}, {
    name: "Ext.",
}, {
    name: "Datum"
}, {
    name: "Größe"
}]
if (widths)
    columns = columns.map((n, i)=> ({ name: n.name, width: widths[i]}))
table.setColumns(columns)

var saveWidths = true
table.addEventListener("columnwidths", e => {
    if (saveWidths) 
        localStorage.setItem("widths", JSON.stringify(e.detail))
})

changeCols.addEventListener("click", () => {
    saveWidths = false
    table.setColumns([{
        name: "Name"
    }, {
        name: "Datum"
    }, {
        name: "Art"
    }])

})

// TODO: Sortable: highlighted, asc, desc
// TODO: SubColumn, sortable