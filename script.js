
( () => {

  // initial values
  const defaultShape = 'dharmachakra'
  const defaultCanvasBgColor = '#222222'

  // Example: fill domSourcesInput with urls from https://placekitten.com
  const defaultSourceUrls = []
  for ( let n = 200; n < 214; n += 1 ) {
    for ( let m = 200; m < 215; m += 1 ) {
      defaultSourceUrls.push( `https://placekitten.com/${n}/${m}` )
    }
  }

  // shape selector
  const domShapeOptions = Array.from( document.getElementsByName( 'shape' ) )
  const domDefaultShapeOption = domShapeOptions.find( o => `${o.value}` === defaultShape ) || domShapeOptions[ 0 ] || null
  if ( domDefaultShapeOption ) {
    domDefaultShapeOption.setAttribute( 'checked', 'checked' )
  }

  // canvas
  const domCanvas = document.getElementById( 'canvas' )
  domCanvas.style.backgroundColor = defaultCanvasBgColor

  // canvas bg color picker
  const domCanvasBgColor = document.getElementById( 'canvas_bg_color' )
  domCanvasBgColor.value = defaultCanvasBgColor

  // on canvas bg color picked => sync canvas bg color
  const onCanvasBgColorPicked = event => domCanvas.style.backgroundColor = event.target.value
  domCanvasBgColor.addEventListener( 'keyup', onCanvasBgColorPicked )
  domCanvasBgColor.addEventListener( 'change', onCanvasBgColorPicked )

  // sources title
  const domSourcesWithCountDisplay = document.getElementById( 'sources_with_count_display' )

  // sources list
  const domSourcesInput = document.getElementById( 'sources_input' )
  domSourcesInput.value = defaultSourceUrls.join( '\n' )

  const getUrls = () => domSourcesInput.value.split( /[\s,;'"]+/g ).filter( u => u.match( /^http(s)?/ ) )

  const getSourcesWithCountDisplay = () => {
    const n = getUrls().length
    let display = 'Sources'
    if ( n ) {
      const N = n.toLocaleString()
      const s = ( 1 < n ) ? 's' : ''
      display = `${N} Source${s}`
    }
    return display
  }
  const updateSourcesWithCountDisplay = () => domSourcesWithCountDisplay.innerText = getSourcesWithCountDisplay()

  updateSourcesWithCountDisplay()

  domSourcesInput.addEventListener( 'keyup', updateSourcesWithCountDisplay )
  domSourcesInput.addEventListener( 'change', updateSourcesWithCountDisplay )

  // grid

  const domGrid = document.getElementById( 'grid' )

  const _ = 0

  // 23 (1), 92 (4)
  const grid50UseCells = [
    [ 1, 1, 1, _, 1, 1, 1 ],
    [ 1, _, _, _, 1, _, 1 ],
    [ 1, 1, 1, _, 1, _, 1 ],
    [ _, _, 1, _, 1, _, 1 ],
    [ 1, 1, 1, _, 1, 1, 1 ]
  ]

  // 36 (1), 144 (4)à
  const gridDharmachakraUseCells = [
    [ _, _, _, _, 1, _, _, _, _ ],
    [ _, 1, _, 1, 1, 1, _, 1, _ ],
    [ _, _, 1, _, 1, _, 1, _, _ ],
    [ _, 1, _, 1, 1, 1, _, 1, _ ],
    [ 1, 1, 1, 1, _, 1, 1, 1, 1 ],
    [ _, 1, _, 1, 1, 1, _, 1, _ ],
    [ _, _, 1, _, 1, _, 1, _, _ ],
    [ _, 1, _, 1, 1, 1, _, 1, _ ],
    [ _, _, _, _, 1, _, _, _, _ ],
  ]

  // 52 (1), 208 (4)
  const gridDharmachakra2UseCells = [
    [ _, _, _, _, _, 1, _, _, _, _, _ ],
    [ _, 1, _, _, _, 1, _, _, _, 1, _ ],
    [ _, _, 1, 1, 1, 1, 1, 1, 1, _, _ ],
    [ _, _, 1, 1, _, 1, _, 1, 1, _, _ ],
    [ _, _, 1, _, 1, 1, 1, _, 1, _, _ ],
    [ 1, 1, 1, 1, 1, _, 1, 1, 1, 1, 1 ],
    [ _, _, 1, _, 1, 1, 1, _, 1, _, _ ],
    [ _, _, 1, 1, _, 1, _, 1, 1, _, _ ],
    [ _, _, 1, 1, 1, 1, 1, 1, 1, _, _ ],
    [ _, 1, _, _, _, 1, _, _, _, 1, _ ],
    [ _, _, _, _, _, 1, _, _, _, _, _ ],
  ]

  const countColumns = grid => grid[ 0 ].length
  const countRows = grid => grid.length

  const sumRow = row => row.reduce( ( sum, value ) => sum + value, 0 )
  const sumGrid = grid => grid.reduce( ( sum, row ) => sum + sumRow( row ), 0 )

  console.log( { gridDharmachakra2UseCellsl: sumGrid( gridDharmachakra2UseCells ) } )

  const getUrlsToDisplay = grid => {
    const urls = getUrls()
    const urlsCount = urls.length

    const cellsToUseCount = sumGrid( grid )

    const minUrlsPerCellCount = Math.floor( urlsCount / cellsToUseCount )

    const urlsPerCell = grid.map( row => row.map( v => v ? [] : null ) )

    let urlsTaken = 0
    urlsPerCell.forEach( ( row, rowIndex ) => {
      row.forEach( ( cell, cellIndex ) => {
        if ( cell ) {
          urlsPerCell[ rowIndex ][ cellIndex ] = urls.slice( urlsTaken, urlsTaken + minUrlsPerCellCount )
          urlsTaken += minUrlsPerCellCount
        }
      } )
    } )
    const remainingUrls = urls.slice( urlsTaken )

    return { urlsPerCell, remainingUrls, cellsToUseCount, minUrlsPerCellCount, urls, urlsCount }
  }

  domGrid.style.display = 'grid'
  domGrid.style.gridTemplateColumns = `repeat( ${countColumns( gridDharmachakra2UseCells )}, auto )`
  domGrid.style.gridTemplateRows = `repeat( ${countRows( gridDharmachakra2UseCells )}, auto )`
  domGrid.style.justifyContent = 'center'
  domGrid.style.justifyItems = 'center'
  domGrid.style.alignContent = 'center'
  domGrid.style.alignItems = 'center'

  const urlsToDisplay = getUrlsToDisplay( gridDharmachakra2UseCells )

  const { urlsPerCell, remainingUrls, cellsToUseCount, minUrlsPerCellCount, urls, urlsCount } = urlsToDisplay

  const imgWidth = 40
  const imgHeight = 40

  const cellWidth = `${imgWidth * 2}px`
  const cellHeight = `${imgHeight * 2}px`

  urlsPerCell.forEach( rows => {
    rows.forEach( cell => {
      const div = document.createElement( 'div' )
      div.style.width = cellWidth
      div.style.height = cellHeight
      if ( Array.isArray( cell ) ) {
        cell.forEach( url => {
          const img = document.createElement( 'img' )
          img.src = url
          img.width = imgWidth
          img.height = imgHeight
          div.appendChild( img )
        } )
      }
      domGrid.appendChild( div )
    } )
  } )

  const domRemaining = document.getElementById( 'remaining' )
  remainingUrls.forEach( url => {
    const img = document.createElement( 'img' )
    img.src = url
    img.width = imgWidth
    img.height = imgHeight
    domRemaining.appendChild( img )
  } )
  domRemaining.style.width = '100%'

} )()
