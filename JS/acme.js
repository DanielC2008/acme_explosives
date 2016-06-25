"use strict";



// make three promises for each json
var getCategory = function() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: "../JSON/categories.json"
		}).done(function(data) {
			resolve(data);
		}).fail(function(xhr, status, error) {
			reject(error);
		});
	});
};


var getTypes = function() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: "../JSON/types.json"
		}).done(function(data) {
			resolve(data);
		}).fail(function(xhr, status, error) {
			reject(error);
		});
	});
};


var getProducts = function() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: "../JSON/products.json"
		}).done(function(data) {
			resolve(data);
		}).fail(function(xhr, status, error) {
			reject(error);
		});
	});
};


// event listener to get data and populateDom
$("#selector").change(function() {
	var storeCats = [];
	var storeType = [];
	var storeProd = [];
	var specificId;
	var specificType;
	var specificProd;

	getCategory() /* parse and store category*/
		.then(function(data1) {
			storeCats = data1.category;
    	return getTypes(); /* parse and store types*/
  }) 
		.then(function(data2) {
			storeType = data2.types;
			return getProducts(); /* parse and store products*/
	}) 
		.then(function(data3) {
			storeProd = data3.products;
			return neededData(storeCats); /* get specific data needed from JSON 1*/
	}) 
		.then(function(spec1) {
			specificId = spec1;
			return neededDataTwo(storeType, specificId); /* get specific data needed from JSON 1*/
	}) 
		.then(function(spec2) {
			specificType = spec2;
			return neededDataThree(storeProd, specificType);/* get specific data needed from JSON 1*/
	}) 		
		.then(function(spec3) {
			specificProd = spec3;
			return populateDom(specificType, specificProd); /* function to populate dom*/
	});
});



// grab data that is needed
var neededData = function(data1) {
	var selected = $("select option:selected").text();

	function getId(fromCategories) {
		return fromCategories.name === selected;
	}
	return data1.find(getId).id;
};

var neededDataTwo = function(data2, categoryId) {
	function getCategory(fromTypes) {
		return fromTypes.category === categoryId;
	}
	return data2.filter(getCategory);	
};

var neededDataThree = function(data3, productType) {
	var products = [];
	data3.forEach(function(obj) {
		productType.forEach(function (element) {
			for (var types in obj) {
				if (obj[types].type == element.id) {
				 products.push(obj[types]);
				}
			}
		});
	});
	return products;
};


// output selected data to DOM
var populateDom = function(currentType, currentProduct) {
	$("#outputDiv").empty();
  var selected = $("select option:selected").text();
	$("#outputDiv").append("<div class='container'></div>");
	$(".container").append("<div class='row'></div>");
		currentType.forEach(function(element, index){
		$(".row").append(`<div id=wrapper--${index} class="wrapper col-md-4"></div>`);
		$(`#wrapper--${index}`).append(`<div>${selected}</div>`);
		$(`#wrapper--${index}`).append(`<div class="types">${element.name}</div>`);
			currentProduct.forEach(function(elementProd, newIndex){
			if (elementProd.type === element.id)
			$(`<li class="product">${elementProd.name}</li>`).insertAfter(`.types:last`);		
			});	
	});
};
	











