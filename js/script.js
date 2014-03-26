window.addEvent('domready',function() {
  var searchBox = $('search-box'), searchLoaded = false, searchFn = function() {
    if(!searchLoaded) {
      searchLoaded = true;

      var container = new Element('div',{ id: 'search-results', position: 'relative' }).inject($('search-area-custom'),'after');
      var wrapper = new Element('div',{
        id: 'search-result-wrapper',
        styles: {
          position: 'relative'
        }
      }).inject(container);
      new Element('div',{ id: 'search-results-pointer' }).inject(wrapper);
      var contentContainer = new Element('div',{ id: 'search-results-content' }).inject(wrapper);

      var search  = new google.search.WebSearch(),
          control = new google.search.SearchControl(),
          options = new google.search.DrawOptions();

      options.setDrawMode(google.search.SearchControl.DRAW_MODE_TABBED);
      options.setInput(searchBox);

      control.addSearcher(search);
      control.draw(contentContainer,options);
      control.setNoResultsString('Aucun resultat :( ...');

      searchBox.addEvents({
        keyup: function(e) {
          if(searchBox.value && searchBox.value != searchBox.get('placeholder')) {
            jQuery('#search-result-wrapper').css('height', '437px');
            container.fade(0.9);
            jQuery.ajax({
              url: 'http://suggestqueries.google.com/complete/search?client=chrome&q=' + searchBox.value,
              dataType: 'jsonp',
              success: function(data) {
                var autocompleteData = [];
                for (var i = 3; i >= 0; i--) {
                  if(i < data[1].length - 1) {
                    autocompleteData.push(data[1][i])
                  }
                }
                jQuery('#search-box').autocomplete({
                  source : autocompleteData,
                  minLength:1,
                  select: function( event, ui ) {
                  console.log( ui.item ?
                    "Selected: " + ui.item.value + " aka " + ui.item.id :
                    "Nothing selected, input was " + this.value );
                  }
                });
              }
            });
          }
          else {
            container.fade(0);
            jQuery('#search-result-wrapper').css('height', '0px');
          }
        }
      });
      searchBox.removeEvent('focus',searchFn);
    }
  };
  $('search-box').addEvent('focus',searchFn);
  console.log('Google Search : OK');
})

window.addEvent('onload', initialize())

// GEOLOCALISATION

var geocoder;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}
function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  codeLatLng(lat, lng)
}

function errorFunction(){
  console.log('Geolocalisation failed')
}

function initialize() {
  geocoder = new google.maps.Geocoder();
  //displayTwitter();
}

function displayTwitter() {

}

function codeLatLng(lat, lng) {

  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {
            if (results[0].address_components[i].types[b] == 'locality') {
              city = results[0].address_components[i];
              console.log('Geolocalisation : OK');
              break;
            }
          }
        }
        var date = displayDate();
        jQuery('#logo-bjr').append('<span id="whatsup">What\'s up in <b>' + city.short_name + '</b> on this wonderful <b>' + date + '</b>');
        console.log('Date displaying : OK');
      }
    }
  });
}

function displayDate() {
  var today   = new Date();
  var dd      = today.getDate();
  var mm      = today.getMonth()+1; //January is 0!
  var yyyy    = today.getFullYear();
  var nameday = '';

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  jQuery.ajax({
    async: false,
    url: 'http://nameday.tiste.io/namedays/' + yyyy + '' + mm + '' + dd + '.json',
    jsonpCallback: 'nameday',
    dataType: "jsonp",
    success: function(response) {
      //nameday = response[0].name;
      jQuery('#whatsup').append(' (St ' + response[0].name + ') ?');
      console.log('NameDay : OK');
    }
  });

  if(dd == 1) {
    dd = dd + 'st';
  } else if (dd == 2) {
    dd = dd + 'nd';
  } else if (dd == 3) {
    dd = dd + 'rd';
  } else {
    dd = dd + 'th'
  }

  var weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';

  return (weekday[today.getDay()] + ', ' + dd);
}
