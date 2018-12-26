var fs = require("fs");
var obj = JSON.parse(fs.readFileSync("menu.json", "utf8"));

var fileContent = "";

for (var i in obj) {
  /*
    {
    "A": "id",
    "B": "nombre",
    "C": "ingredientes",
    "D": "precio",
    "E": "cat",
    "F": "type"
    },
    cat:
        carta
        promo
        liquidos
        agregado
    type:
        -Checkbox
        envuelto-palta
        envuelto-salmon
        california
        vegetarianos
        especiales
        especiales-fritos
        hosomaki
        nigiris
        temaki
        sashimi
        caliente
        nuevos
        -Menu
        promo
        liquidos
        agregado

        87-98 son separados desde el menu
        1-210 expluyendo los anteriores son filtrados desde menu lateral checkbox y filtro de palabras

    */
  var id = obj[i].A;
  var name = obj[i].B;
  var ingredients = obj[i].C;
  var price = obj[i].D;
  var cat = obj[i].E;
  var menuType = obj[i].F;
  var ingredientsFiltered =
    cat +
    " " +
    menuType +
    " " +
    ingredients
      .replace(/\,/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/envuelto/g, "")
      .replace(/acompanado/g, "")
      .replace(/en/g, "")
      .replace(/con/g, "")
      .replace(/#/g, " ")
      .replace(/  +/g, " ")
      .replace(/\s+$/, "")
      .toLowerCase();
  var menuTypeString = menuType;
  if (menuType === "envuelto-palta") {
    menuTypeString = "Envueltos en palta"
  } else if (menuType === "envuelto-salmon") {
    menuTypeString = "Envueltos en salmon"
  }
  else if (menuType === "vegetarianos") {
    menuTypeString = "Vegetarianos"
  }
  else if (menuType === "especiales") {
    menuTypeString = "Especiales"
  }
  else if (menuType === "especiales-fritos") {
    menuTypeString = "Especiales fritos"
  }
  else if (menuType === "hosomaki") {
    menuTypeString = "Hosomaki"
  }
  else if (menuType === "nigiris") {
    menuTypeString = "Nigiris"
  }
  else if (menuType === "temaki") {
    menuTypeString = "Temaki"
  }
  else if (menuType === "sashimi") {
    menuTypeString = "Sashimi"
  }
  else if (menuType === "caliente") {
    menuTypeString = "Comida caliente"
  }
  else if (menuType === "nuevos") {
    menuTypeString = "Nuevos"
  }

  var uniqueList = ingredientsFiltered
    .split(" ")
    .filter(function (item, i, allItems) {
      return i == allItems.indexOf(item);
    })
    .join(" ");

  if (id == 98 || id == 99) {
    console.log(id);
    var promoList = ingredients.split("#");
    var texto = "";
    for (var i = 0; i < promoList.length; i++) {
      texto = texto + "<p>" + promoList[i] + "</p> ";
    }
    fileContent =
      fileContent +
      '<li class="mix ' + uniqueList + " " + id + ' stats-container">\n' +
      '<span class="product_price">$' + price + "</span>\n" +
      '<span class="product_name">' + id + ".- " + name + "</span>\n" +
      texto +
      "<p class='menuTypeString'>" + menuTypeString + "</p> \n" +
      "</li>\n";
  } else {
    fileContent =
      fileContent +
      '<li class="mix ' + uniqueList + " " + id + ' stats-container">\n' +
      '<span class="product_price">$' + price + "</span>\n" + '<span class="product_name">' + id + ".- " + name + "</span>\n" +
      "<p>" + ingredients + "</p> \n" +
      "<p class='menuTypeString'>" + menuTypeString + "</p> \n" +
      "</li>\n\n";
  }
}
fs.writeFile("menu.html", fileContent, err => {
  if (err) throw err;
  console.log("The file was succesfully saved!");
});