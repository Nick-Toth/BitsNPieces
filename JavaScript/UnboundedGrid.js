// ********************************************************************
// 
//
//
//
// ********************************************************************


// Returns a JSON object containing default settings for the UnboundedGrid.
const UGsettings = ( _ => { return {
  // **************
  // Grid Settings:
  // **************
  // Determines the numbers of rows and columns in the grid UI.
  'rows':10, 'cols':10,

  // Set this to false if you don't want the grid to be draggable.
  'translate_on_drag': true,
  // These values can be used to scale the speed of grid translation during drag events.
  'drag_speed': {'vertical':0.2, 'horizontal':0.2},//{'vertical':0.485, 'horizontal':0.335},//{'vertical':0.245, 'horizontal':0.1702},

  // Adds a border to the grid UI.
  'grid_border':'2px solid black',

  // **************
  // Cell Settings:
  // **************

  // The initial status of each cell is determined by this function of that cell's position in the grid.
  'initial_status': ((row, col) => 0),
  'init_cell_on_access': false, // Initializes uninitialized cells when getCell is called. Very handy, but better to keep off. 

  'highlight_hovered_cell': false,
  'hovered_cell_color': 'rgba(0,0,0,0.0)',

  // Set this to false if you don't want the cells to change when clicked.
  'update_on_click': true,
  // Determines how cell status changes when clicked.
  'status_on_click': ((status, row, col) => status),

  // The color of each cell is determined by this function of that cell's status and position in the grid.
  'cell_color_function': ((status, row, col) => 'white'),
  // The text-content of each cell is determined by this function of that cell's status and position in the grid.
  // Positioning svg text is finicky. I tried to make this look nice in general, but you might face
  // some issues depending on how you use it. 
  'cell_text_function': ((status, row, col) => ''),

  // Styling for grid-lines. Set width to 0 for if you don't want grid-lines.
  'cell_border':{'color':'black', 'width':'0.25'}
}});


function UnboundedGrid( settings = UGsettings()
){

  // *********
  // Grid Data
  // *********

  this.status_on_click = settings['status_on_click']
  this.cell_fill_color_map = settings['cell_color_function']
  this.cell_text_map = settings['cell_text_function']
  this.initial_status = settings['initial_status']

  this.rows = settings['rows']
  this.cols = settings['cols']
  // Sets the size of the cells in terms of the svg viewbox.
  this.cell_size = {'width':100/(this.cols), 'height':100/this.rows }

  this.grid_data = {} // JSON Matrix of all grid data (on-screen and off-screen).
  this.cells = {}; // JSON Matrix of rendered svg cell objects for re-rendering by index.

  this.grid_container; // Svg container -- an <svg> element. 
  this.grid; // svg grid object -- a <g> element containing grid cells.

  // For keeping track of how much the graph has been translated over the life of the program.
  this.offset = {'horizontal':0, 'vertical':0};
  // For keeping track of how much the graph has been translated during a drag event.
  this.origin = {'rows':0, 'cols':0};

  let drag_is_active = false;

  // *****
  // Setup
  // *****

  // Initialization.
  this.build = (location => {

    // Adds a css class called "unselectable" that prevents unwanted selection.
    // This is important if rendering text in cells. It wouldn't really cause
    // any harm to remove it, but it would be highly unattractive and obnoxious. :p
    makeUnselectableClass()

    this.grid_container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.grid = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.grid_container.setAttribute('viewBox', '0 0 100 100');
    this.grid_container.setAttribute('preserveAspectRatio', 'none');

    this.grid_container.style.border = settings['grid_border']

    for(var r = -1; r < this.rows+1; ++r)
    {
      this.cells[r] = {}
      for(var c = -1; c < this.cols+1; ++c)
      {
        const cell_container = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const cell_text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        cell.row = r
        cell.col = c
        cell.status = this.initial_status(r,c)

        cell.setAttribute("x", (c*this.cell_size['width']).toString());
        cell.setAttribute("y", (r*this.cell_size['height']).toString());
        cell.setAttribute("width", this.cell_size['width'].toString());
        cell.setAttribute("height", this.cell_size['height'].toString());
  
        cell.setAttribute("stroke-width", settings['cell_border']['width']);
        cell.setAttribute("stroke", settings['cell_border']['color']);
        cell.setAttribute("fill", this.cell_fill_color_map(cell.status, r, c));

        // Increments the cell's status, and updates the UI accordingly.
        cell.toggle = (_ => {
          const [dc, dr] = cellOffset()
          //console.log('touched cell# ', [cell.row-dr,cell.col-dc])
          cell.status = this.status_on_click(cell.status, cell.row-dr, cell.col-dc)
          if(this.grid_data[cell.row-dr] === undefined){this.grid_data[cell.row-dr] = {}}
          this.grid_data[cell.row-dr][cell.col-dc] = cell.status
          cell.update(cell.status, cell.row-dr, cell.col-dc)
        })

        // Updates the cell's color to match its status.
        cell.update = ((status, row, col) => {
          cell.status = status;
          cell_text.textContent = this.cell_text_map(status, row, col)
          cell.setAttribute("fill", this.cell_fill_color_map(status, row, col));
        })

        // Click listeners for changing cell status.
        let dont_click_cell = false

        // Setup click listeners, if desired.
        if(settings['update_on_click'])
        {
          //cell_container.addEventListener('mousedown', (e) => {})
          
          if(settings['highlight_hovered_cell'])
          {
            cell_container.addEventListener('mouseenter', e => {
              cell.setAttribute("fill", settings['hovered_cell_color']);
            })
            cell_container.addEventListener('mouseleave', e => {
              cell.setAttribute("fill", this.cell_fill_color_map(cell.status, cell.row, cell.col));
            })
          }

          cell_container.addEventListener('mousemove', e => {
            dont_click_cell = drag_is_active
          })

          cell_container.addEventListener('mouseup', e => {
            if(dont_click_cell){ dont_click_cell = false; return }
            cell.toggle()
          })
        }

        // Create a text element, and center it relative to the new cell rect.
        cell_text.classList.add('unselectable') // Eliminates unwanted user selection during drag events.
        cell_text.textContent = this.cell_text_map(cell.status, cell.row, cell.col)
        cell_text.setAttribute("x",(c*this.cell_size['width'] + this.cell_size['width']/2).toString())
        cell_text.setAttribute("y",(r*this.cell_size['height'] + this.cell_size['height']/1.6).toString())
        //cell_text.setAttribute('textLength', this.cell_size['width']/2);
        cell_text.setAttribute("fill", 'white');
        cell_text.setAttribute("text-anchor", "middle");
        //cell_text.setAttribute("font-family",'Roboto');
        cell_text.setAttribute("font-size",(min(this.cell_size['width'],this.cell_size['height'])/2).toString());

        this.cells[r][c] = cell
        cell_container.appendChild(cell);
        cell_container.appendChild(cell_text);
        this.grid.appendChild(cell_container);
      }
    }

    this.grid.setAttribute('width', '100%');
    this.grid.setAttribute('height', '100%');
    this.grid_container.appendChild(this.grid);

    this.grid_container.setAttribute('width', '100%');
    this.grid_container.setAttribute('height', '100%');
    location.appendChild(this.grid_container);
    
    if(settings['translate_on_drag'])
      this.addDragEventListeners()
  })


  // Translates the grid so that the upper left corner is aligned with a particular cell.
  // e.g. moveTo(0,0) moves the grid to its initial location.
  this.moveTo = ((cy, cx) => {
    if(cy % 1 !== 0 || cx % 1 !== 0)
      return Error("Cant move to a non-integer coordiante!");

    // Reset the grid translation, which makes everything way easier.
    this.grid.setAttribute("transform", "translate(0,0)")

    if(cx > 0){ cx += 1; }
    if(cy > 0){ cy += 1; }
    this.offset['horizontal'] = cx*this.cell_size['width'];
    this.offset['vertical'] = -cy*this.cell_size['height'];
    this.update();
    if(cx > 1){ this.offset['horizontal'] -= this.cell_size['width'];}
    if(cy > 1){ this.offset['vertical'] += this.cell_size['height']; }
  })

  // Empties the grid.
  this.clear = (_ => {
    const grid_row_keys = Object.keys(this.grid_data);

    // Save the location of every living cell.
    for(var i = 0; i < grid_row_keys.length; ++i)
    {
      const grid_col_keys = Object.keys(this.grid_data[grid_row_keys[i]]);

      for(var j = 0; j < grid_col_keys.length; ++j)
        this.grid_data[grid_row_keys[i]][grid_col_keys[j]] = this.initial_status(grid_row_keys[i], grid_col_keys[j])
    }
    this.update()
    //this.moveTo(0,0)
  })

  let cellOffset = ( _ => {
    const off_c = ceileyfloor(-this.offset['horizontal']/this.cell_size['width']),
          off_r = ceileyfloor(this.offset['vertical']/this.cell_size['height']);
    return [off_c - sign(off_c), off_r - sign(off_r)]
  })


  // Updates the UI grid.
  // i.e. Updates cells according to the "visible range" of grid_data.
  this.update = (_ => {

    const [off_c, off_r] = cellOffset()
    for(var r = -1; r < this.rows+1; ++r)
    {
      for(var c = -1; c < this.cols+1; ++c)
      {
        if(this.grid_data[r-off_r] === undefined) { this.grid_data[r-off_r] = {} }
        if(this.grid_data[r-off_r][c-off_c] === undefined) { this.grid_data[r-off_r][c-off_c] = this.initial_status(r-off_r,c-off_c) }

        this.cells[r][c].update(this.grid_data[r-off_r][c-off_c], r-off_r, c-off_c)
      }
    }
  })


  // Updates a particular cell's status, and updates the UI.
  // Note that this function updates the UI with each call.
  // If you want to update more than one cell, you should
  // use setCells (which only updates the UI once).
  this.setCell = ((row, col, status) => {

    // Updates the cell status.
    if(this.grid_data[row] === undefined){ this.grid_data[row] = {}}
    this.grid_data[row][col] = status;

    // Updates the UI.
    this.update()
  })


  // Updates a collection of cells, and updates the UI.
  // Use this function if you want to update multiple cells
  // at once. Use setCell if you only want to update one cell.
  this.setCells = (cell_definitions => {

    // Extracts the indices and new statuss of the cells being set, and updates the cell statuss.
    const num_cell_defs = cell_definitions.length;
    for(var i = 0; i < num_cell_defs; ++i)
    {
      const row = cell_definitions[i]['row'],
            col = cell_definitions[i]['col'],
            status = cell_definitions[i]['status']

      if(this.grid_data[row] === undefined){ this.grid_data[row] = {}}
      this.grid_data[row][col] = status;
    }

    // Updates the UI.
    this.update()
  })


  // Returns the status of a given cell.
  this.getCell = ((row, col) => {
    if(this.grid_data[row] === undefined || this.grid_data[row][col] === undefined)
    {
      let unset_status = this.initial_status(row, col)
      if(settings['init_cell_on_access'])
      {
        if(this.grid_data[row] === undefined)
          this.grid_data[row] = {}
        this.grid_data[row][col] = unset_status
      }
      return unset_status
    }
    return this.grid_data[row][col];
  })


  // ********************
  // Grid Event Listeners
  // ********************

  this.trans = {'x': 0, 'y': 0}

  // Adds drag event listeners so that the grid can be translated by a drag gesture.
  this.addDragEventListeners = (_ => {

    let drag_speed = settings['drag_speed'];

    // event_start_body, event_move_body, and event_end_body represent the drag
    // event handler functionality that is equivalent for mobile and desktop.
    // The event listeners are applied below by composing these functions with
    // (mobile/desktop)-specific code. If you want to change drag behaviors,
    // then you probably want to edit these functions.
    let event_start_body = (e => {
      drag_is_active = true
      // Record the location where the drag started.
      this.origin['rows'] = e.clientX;
      this.origin['cols'] = e.clientY;
    })

    let event_move_body = (e => {
      if(drag_is_active)
      {
        const cx = e.clientX, cy = e.clientY;

        const dr = (cx-this.origin['rows'])*drag_speed['horizontal'],
              dc = (cy-this.origin['cols'])*drag_speed['vertical']

        this.offset['horizontal'] -= dr
        this.offset['vertical'] += dc

        const row_offset = this.offset['vertical']/this.cell_size['height'],
              col_offset = this.offset['horizontal']/this.cell_size['width'];
        if(row_offset % 1 !== 0 && col_offset % 1 !== 0)
        {
          this.trans['x'] = (-this.offset['horizontal'] % this.cell_size['width']),
          this.trans['y'] = (this.offset['vertical'] % this.cell_size['height']);

          this.grid.setAttribute( "transform", "translate(" + this.trans['x'].toString() + ", " + this.trans['y'].toString() + ")")

          // Record the current touch location as the origin for the next update.
          this.origin['rows'] = cx; this.origin['cols'] = cy;

          this.update()
        }
      }
    })

    let event_end_body = (e => {
      drag_is_active = false
      this.origin['rows'] = 0;
      this.origin['cols'] = 0
    })

    // Hypothetically, ismobile is true iff the user is on a mobile device / browser.
    const ismobile = (a => { return (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform) || /Tablet|iPad|(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) }) (navigator.userAgent||navigator.vendor||window.opera);

    // Records the appropriate event names corresponding to the user's device.
    const event_names = ismobile? { 'start':'touchstart', 'move':'touchmove', 'end':'touchend' }
                                : { 'start':'mousedown',  'move':'mousemove', 'end':'mouseup' };

    // The event coordinates (clientX and clientY) are accessed differently for mobile and desktop.
    // This function returns the appropriate source for clientX and clientY depending on ismobile.
    let event_coord_source = (e => ismobile? (e.touches[0] || e.changedTouches[0]) : e);

    // Apply the drag event listeners/handlers.
    this.grid.addEventListener(event_names['start'], e => event_start_body(event_coord_source(e)))
    this.grid.addEventListener(event_names['move'], e => event_move_body(event_coord_source(e)))
    this.grid.addEventListener(event_names['end'], e => event_end_body(event_coord_source(e)))

  })


  // Creates a css class that makes elements unselectable.
  // This is applied to cell text components. Without it, cell
  // text will be selected during drag events, which is ugly.
  function makeUnselectableClass()
  {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.unselectable { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }';
    document.getElementsByTagName('head')[0].appendChild(style);
  }


  // Some useful math, used throughout.
  const sign = Math.sign,
        floor = Math.floor,
        min = Math.min,
        // ceileyfloor maps every number in the interval [a,a+1) to a for each integer a.
        // Equivalently: floor(x) for x ≤ 0, and ceil(x) for x>0.
        ceileyfloor = (x => floor(x) + (x > 0));
}
