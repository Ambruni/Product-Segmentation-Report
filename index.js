//contains all the entries of the excel sheet
let categorySegmentsDataArray = [];

let filteredArray = [];

let categoryNameOrderState = 1;
let firstTransactionDateOrderState = 1;
let lastTransactionDateOrderState = 1;
let revenueOrderState = 1;
let segmentOrderState = 1;

//function to convert excel data to json
function parseExcelFile(event){
  
  //get the file and read contents
  let rawFile = event.target.files[0];
  let reader = new FileReader(rawFile);

  //refactor variable names
    reader.onload = function(event) {
      let data = event.target.result;
      let workbook = XLSX.read(data, {
        type: 'binary'
      });

      //convert excel data to JSON objects
      workbook.SheetNames.forEach(function(sheetName) {
        let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        let json_object = JSON.stringify(XL_row_object);
        categorySegmentsDataArray = XL_row_object;
        //save the main array to filteredArray to use it for filtering later
        filteredArray = categorySegmentsDataArray;
        
        let productsSegmentationMain = document.getElementById("product-segmentation-main");
  
        productsSegmentationMain.style.display = 'block';
        
        //populateData is used to fill the data into the columns
        populateData();
        
        populateChart();
        barChartforCategories();
        
        const coverPage = document.getElementById("cover-page");
        
        coverPage.id += ' hidden';
        
        const fileSelectionContainer = document.getElementById("select-file");
        
        const fileSelectionContainerHeading = document.getElementById("select-file-heading");
        const fileSelectionButton = document.getElementById("file-selection-button-text");
        
        fileSelectionContainerHeading.style.color = "#2980b9";
        fileSelectionContainerHeading.style.fontSize = "20px";
        
        fileSelectionButton.style.color = "#2980b9";
        fileSelectionButton.style.borderColor = "#2980b9";
        
        fileSelectionContainer.style.marginTop = "30px";
        
      })

    };

    //log if there is any error
    reader.onerror = function(ex) {
      console.log(ex);
    };

    reader.readAsBinaryString(rawFile);
  
}

function refreshTableData(array) {

  let table = document.getElementById("category-data-table");

  while (table.lastChild) {
    if(table.childNodes.length <= 2) {
      break;
    }
    table.removeChild(table.lastChild);
  }

  for(let object of array){
    
    //dynamically creates the number of rows required
    const tableRow = document.createElement("tr");
    table.appendChild(tableRow);
    
    //get the values of the object
    const values = Object.values(object);
    
    for(let data of values){
      
      //create data element and fill the details
      const tableData = document.createElement("td");
      tableRow.appendChild(tableData);
      tableData.append(data);
    
    }
  }

}

//function to fill the data for each of the columns of excel sheet
function populateData(){
  
  //initialise the values needed to be calculated
  let totalRevenue = 0;
  let totalCategories = categorySegmentsDataArray.length;
  let averageRevenue = 0;
  
  let segments = [];

  refreshTableData(categorySegmentsDataArray);
  
  for(let categoryObject of categorySegmentsDataArray){
    totalRevenue+=parseFloat(categoryObject.Revenue);
    segments.push(categoryObject.Segment);
  }
  
  //Get unique elements to populate the dropdown list for filtering purpose
  const uniqueSegments = getUniqueElementsInArray(segments);
  
  //fill in the unique categories into the dropdown list
  let categorySelector = document.getElementById("category-selector");
  for(let data of uniqueSegments){
    const selector = document.createElement("option");
    selector.append(data);
    selector.value = data;
    categorySelector.appendChild(selector);
    
  }
  
//<!--------PRODUCT SEGMENT OVERVIEW DATA----->
  //display total revenue
  let totRevenue = document.getElementById("total-revenue");
  totRevenue.innerHTML = totalRevenue.toFixed(3);
  
  //display total number of categories
  let totCategories = document.getElementById("total-categories");
  totCategories.innerHTML = totalCategories;
  
  //populate revenue from each category and display
  averageRevenue = totalRevenue/totalCategories;
  let avgRevenue = document.getElementById("average-revenue");
  avgRevenue.innerHTML = averageRevenue.toFixed(3);
  
}

function getUniqueElementsInArray(array){
  
  let uniqueArray = [];
  
  //loop to check for unique elements
  for(let element of array){
    
    if (uniqueArray.length === 0) {
      uniqueArray.push(element);
    }
    
    for (let uniqueArrayIndex = 0; uniqueArrayIndex < uniqueArray.length; uniqueArrayIndex++) {
      if(uniqueArrayIndex === uniqueArray.length - 1 && uniqueArray[uniqueArrayIndex] !== element) {
        uniqueArray.push(element);
      }
      
      if(uniqueArray[uniqueArrayIndex] === element) {
        break;
      } else {
        continue;
      }
    }
    
  }
  
  return uniqueArray;
}

//function to populate data based on the filtered category
function filterByCategory(event){
  
  filteredArray = [];
  
  const selectedCategory = event.target.value;
  
  let totalRevenueOfCategory = 0;
  
  for (let categorySegment of categorySegmentsDataArray) {
    
    if(categorySegment.Segment == selectedCategory) {
      filteredArray.push({...categorySegment});
      
      totalRevenueOfCategory += parseFloat(categorySegment.Revenue);
    }
    
  }
  
  const revenueFromCategoryLabel = document.getElementById("revenue-from-category-label");
  
  const revenueFromCategoryValue = document.getElementById("revenue-from-category");
  
  revenueFromCategoryLabel.innerHTML = `Revenue from ${selectedCategory}`;
  
  revenueFromCategoryValue.innerHTML = totalRevenueOfCategory.toFixed(3);
  
  refreshTableData(filteredArray);
  
}

//function to sort vaules by column
function sortData(type, property) {
  
  let order;
  
  if(property == "CATEGORY_NAME") {
    if(categoryNameOrderState === 1) {
      categoryNameOrderState = -1;
      order = categoryNameOrderState;
    } else {
      categoryNameOrderState = 1;
      order = categoryNameOrderState;
    } 
  } else if (property == "First_Transaction_Date") {
    if(firstTransactionDateOrderState === 1) {
      firstTransactionDateOrderState = -1;
      order = firstTransactionDateOrderState;
    } else {
      firstTransactionDateOrderState = 1;
      order = firstTransactionDateOrderState;
    }        
  } else if (property == "Last_Transaction_Date") {
    if(lastTransactionDateOrderState === 1) {
      lastTransactionDateOrderState = -1;
      order = lastTransactionDateOrderState;
    } else {
      lastTransactionDateOrderState = 1;
      order = lastTransactionDateOrderState;
    }        
  } else if (property == "Revenue") {
    if(revenueOrderState === 1) {
      revenueOrderState = -1;
      order = revenueOrderState;
    } else {
      revenueOrderState = 1;
      order = revenueOrderState;
    }        
  } else if (property == "Segment") {
    if(segmentOrderState === 1) {
      segmentOrderState = -1;
      order = segmentOrderState;
    } else {
      segmentOrderState = 1;
      order = segmentOrderState;
    }        
  }
  
  for (let categorySegmentIndex = 0; categorySegmentIndex < filteredArray.length - 1; categorySegmentIndex++) {
    
    for(let nextCategorySegmentIndex = 0; nextCategorySegmentIndex < filteredArray.length - categorySegmentIndex - 1; nextCategorySegmentIndex++) {
      
      const comparedState = filteredArray[nextCategorySegmentIndex][property].toLowerCase().localeCompare(filteredArray[nextCategorySegmentIndex + 1][property].toLowerCase());
     
      if(order === 1) {
        
        if(type === 'string') {
          if (comparedState === -1 || comparedState === 0) {
            continue;
          }
        } else if (type === 'number') {
          if(parseFloat(filteredArray[nextCategorySegmentIndex][property]) < parseFloat(filteredArray[nextCategorySegmentIndex + 1][property])) {
            continue;
          } 
        } else {
          var date1 = Date.parse(filteredArray[nextCategorySegmentIndex][property]);
          var date2 = Date.parse(filteredArray[nextCategorySegmentIndex + 1][property]);
          if (date1 < date2) {
              continue;
          }
        }
      
    } else if (order === -1) {
      
      if(type === 'string') {
          if (comparedState === 1 || comparedState === 0) {
            continue;
          }
        } else if (type === 'number') {
          if(parseFloat(filteredArray[nextCategorySegmentIndex][property]) > parseFloat(filteredArray[nextCategorySegmentIndex + 1][property])) {
            continue;
          } 
        } else {
          var date1 = Date.parse(filteredArray[nextCategorySegmentIndex][property]);
          var date2 = Date.parse(filteredArray[nextCategorySegmentIndex + 1][property]);
          if (date1 > date2) {
              continue;
          }
        }
      
    }
    
    let temporaryObject = {...filteredArray[nextCategorySegmentIndex]};
    filteredArray[nextCategorySegmentIndex] = {...filteredArray[nextCategorySegmentIndex + 1]};
    filteredArray[nextCategorySegmentIndex + 1] = {...temporaryObject};
    
  }
      
    }
  
  refreshTableData(filteredArray);
  
}


function populateChart() {
  // create a Pareto chart
  
  let graphInputData = [];
  let segments = [];
  
  for (let categorySegment of categorySegmentsDataArray) {
     segments.push(categorySegment.Segment);
  }
  
  for(let element of getUniqueElementsInArray(segments)) {
    let count = 0;
    
    for (let categorySegment of categorySegmentsDataArray) {
    
      if(categorySegment.Segment == element) {
        count++;
      }
    
    }
    
    graphInputData.push({
      x: element,
      value: count
    });
    
  }
  
  
  chart = anychart.pareto(graphInputData);

  // get pareto column series
  // and configure fill and stroke
  var column = chart.getSeriesAt(0);
  column.fill(function() {
    return this.sourceColor;
  });
  column.stroke(function() {
    return this.sourceColor;
  });

  // format column series label to show RF
  column.labels().enabled(true).format("{%RF}%");

  // set the chart title
  chart.title("Category-Revenue Pareto Chart");

  // set the container id and draw
  chart.container("pareto-chart").draw();
}

function barChartforCategories(){
  
   let graphInputData = [];
  let segments = [];
  
  for (let categorySegment of categorySegmentsDataArray) {
     segments.push(categorySegment.Segment);
  }
  
  for(let element of getUniqueElementsInArray(segments)) {
    let count = 0;
    
    for (let categorySegment of categorySegmentsDataArray) {
    
      if(categorySegment.Segment == element) {
        count++;
      }
    
    }
    
    graphInputData.push({
      x: element,
      value: count
    });
    
  }

// create a chart
chart = anychart.bar();

// create a bar series and set the data
var series = chart.bar(graphInputData);

// set the container id
chart.container("bar-chart");

// initiate drawing the chart
chart.draw();
}