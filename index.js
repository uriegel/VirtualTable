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
    name: "Name",
    isSortable: true
}, {
    name: "Ext.",
}, {
    name: "Datum",
    isSortable: true
}, {
    name: "Größe",
    isSortable: true
}]
if (widths)
    columns = columns.map((n, i)=> ({ ...n, width: widths[i]}))
table.setColumns(columns)

var saveWidths = true
table.addEventListener("columnwidths", e => {
    if (saveWidths) 
        localStorage.setItem("widths", JSON.stringify(e.detail))
})
table.addEventListener("columclick", e => {
    console.log("columclick", e.detail)
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

// TODO: SubColumn, sortable
// TODO: array[0..1000].map(name+i), setItems (with columns and id), display name
// TODO: Scolling
// TODO: Theming
