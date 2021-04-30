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
        const style = getComputedStyle(document.body)
        exifColor = style.getPropertyValue('--exif-color') 
        selectedExifColor = style.getPropertyValue('--selected-exif-color') 
        table.classList.add(theme)    
        table.themeChanged()
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

var exifColor = getComputedStyle(document.body).getPropertyValue('--exif-color') 
var selectedExifColor = getComputedStyle(document.body).getPropertyValue('--selected-exif-color') 

const widthstr = localStorage.getItem("widths")
const widths = widthstr ? JSON.parse(widthstr) : []
let columns = [{
    name: "Name",
    isSortable: true,
    render: (td, item) => {
        var t = document.querySelector('#folder')
        td.appendChild(document.importNode(t.content, true))
        const span = document.createElement('span')
        span.innerHTML = item.name
        td.appendChild(span)
    }
}, {
    name: "Ext.",
    render: (td, item) => td.innerHTML = item.ext
}, {
    name: "Datum",
    isSortable: true,
    render: (td, item) => {
        td.innerHTML = item.date
        td.style.color = item.isSelected ? selectedExifColor : exifColor
    }
}, {
    name: "Größe",
    isSortable: true,
    isRightAligned: true,
    render: (td, item) => {
        td.innerHTML = item.size
        td.classList.add("rightAligned")
    }
}]
if (widths)
    columns = columns.map((n, i)=> ({ ...n, width: widths[i]}))
    
table.setColumns(columns)
const items = Array.from(Array(4000).keys())
    .map(index => ({
        name: "Eintrag " + index,
        ext: "ext",
        date: "24.03.1999 14:23",
        size: 2344 + index
    }))

table.setItems(items)
table.setRestriction((items, restrictValue) => items.filter(n => n.name.toLowerCase().startsWith(restrictValue.toLowerCase())))

var saveWidths = true
table.addEventListener("columnwidths", e => {
    if (saveWidths) 
        localStorage.setItem("widths", JSON.stringify(e.detail))
})
table.addEventListener("columclick", e => {
    console.log("columclick", e.detail)
})
table.addEventListener("keydown", evt => {
    switch (evt.which) {
        case 35: // end
            if (evt.shiftKey) {
                const pos = table.getPosition()
                items.forEach((item, i) => item.isSelected = !item.isNotSelectable && i >= pos)                     
                table.refresh()
            }
            break
        case 36: // home
            if (evt.shiftKey) {
                const pos = table.getPosition()
                items.forEach((item, i) => item.isSelected = !item.isNotSelectable && i <= pos)                     
                table.refresh()
            }
            break
        case 45: { // Ins
            const pos = table.getPosition()
            items[pos].isSelected = !items[pos].isSelected 
            table.setPosition(pos + 1)
            break
        }
        case 107: { // Numlock +
            items.forEach(n => n.isSelected = true)
            table.refresh()
            break
        }
        case 109: { // Numlock -
            items.forEach(n => n.isSelected = false)
            table.refresh()
            break
        }
    }
})

changeCols.addEventListener("click", () => {
    saveWidths = false
    table.setColumns([{
        name: "Name",
        isSortable: true,
        subItem: {
            name: "Ext.",
            isSortable: true
        }
    }, {
        name: "Datum", 
        isSortable: true
    }, {
        name: "Art"
    }])

})

// TODO: SetSelection callback on displayItems
// TODO: Restriction backspace: 


