let map;
let infoWindow;
// variable to open infoWindow
let popInfoWindow;
let selectMarker;
//let expandMenu;

//create the markers array to hold all markers 
let markers = []; 
//create locations array to hold the markers and the information on the location of the markers
const locations = [
        {title: "The Palace Museum", location: {lat: 39.9163447, lng: 116.3971546}, id:0},
        {title: "Tiananmen", location: {lat: 39.9087202, lng: 116.3974799}, id:1},
        {title: "Jingshan Park", location: {lat: 39.9250988, lng: 116.3968433}, id:2},
        {title: "Nine Dragon Walls", location: {lat: 39.918474, lng: 116.400398}, id:3},
        {title: "Wangfujing Pedestrian Street", location: {lat: 39.910959, lng: 116.411341}, id:4},
        {title: "National Art Museum of China", location: {lat: 39.925092, lng: 116.409285}, id:5}
    ];

const AppViewModel = function() {
    let self = this;    
    self.visibleMarkers = ko.observableArray([]);

    locations.forEach(function(lo){
        self.visibleMarkers.push({title: lo.title, position: lo.position});
    });

    //let expandOrCollapse;
    self.expandOrCollapse = ko.observable('open');
    self.expandMenu = function() {
        // let isDrawerVisible = $('#drawer').is(":visible");
        // if (isDrawerVisible) self.expandOrCollapse = 'close';
        // else self.expandOrCollapse = 'open';
        //self.expandOrCollapse = ko.observable('open');
        let drawer = document.querySelector('.nav');
        // if(drawer.classList[1] == 'open') {
        //     //drawer.classList[1] = 'close';
        //     drawer.classList[1] = self.expandOrCollapse('close');
        //     console.log(drawer);
        // }
        // else {
        //     drawer.classList[1] = self.expandOrCollapse('close');
        //     draw.className = 
        // }
        if (drawer.classList)
        {
            let classes = drawer.className.split(" ");
            let i = classes.indexOf(self.expandOrCollapse());

            if(i> -1 ) {
                classes.splice(i, 1);
                if(self.expandOrCollapse() == 'open') {
                    self.expandOrCollapse('close');
                    
                }
                else {self.expandOrCollapse('open');}
                // classes.push(self.expandOrCollapse());
                // drawer.className = classes.join(" ");
            }
            else {
                classes.push(self.expandOrCollapse);
                drawer.className = classes.join(" ");
            }
        }
        else {
            let classes = drawer.className.split(" ");
            let i = classes.indexOf(self.expandOrCollapse);

            if(i>=0) {
                classes.splice(i, 1);
            }
            else {
                classes.push(self.expandOrCollapse);
                drawer.className = classes.join(" ");
            }
        }
        
    //     for(let i = 0; i < drawer.classList.length; i++) {
    //     console.log("drawer is " + drawer.classList[i]);
    //     //drawer.classList.toggle(self.expandOrCollapse);
    //     }
     }

    self.searchInput = ko.observable("");

    //everytime searchInput changes, this gets computed again
    self.filteredMarkers = ko.computed(function(){
        if(!self.searchInput()) {
        
            for(let i=0; i<markers.length; i++)
            {
                markers[i].setVisible(true);
            }
            return self.visibleMarkers();

        }
        else {

            //variable to hold filtered locations after user enter the search criteria
            let filteredPlace = self.visibleMarkers().
            filter(place=>place.title.toLowerCase().indexOf(self.searchInput().toLowerCase()) > -1);
            
            for(let i=0; i<markers.length; i++)
            {
                let markerTitle = markers[i].title.toLowerCase();
                let matched = markerTitle.indexOf(self.searchInput()) >= 0;
                //Only show the markers that match the search criteria
                markers[i].setVisible(matched);
            }
            return filteredPlace;
        }
    });

    //Function variable to select the marker when a name in location list is clicked and open 
    // the infoWindow
    selectMarker = function() {
        let self = this;
        let matchedMarker;
        let searchTitle = self.title.toLowerCase();
        for(let i=0; i<markers.length; i++)
        {
            let markerTitle = markers[i].title.toLowerCase();
            let matched = markerTitle.indexOf(searchTitle) > -1;
            if(matched)
            {
                matchedMarker = markers[i];
                break;
            }
        }
        popInfoWindow(matchedMarker);
    };
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 39.9163447, lng: 116.3971546},
          zoom: 13,
        });

    //example codes from udacity class
    infoWindow = new google.maps.InfoWindow();
    let bounds = new google.maps.LatLngBounds();

    // Style the markers a bit. This will be our listing marker icon.
    let defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    let highlightedIcon = makeMarkerIcon('FFFF24');

    for (let i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        let location = locations[i].location;
        let title = locations[i].title;
        // Create a marker per location, and put into markers array.
        let marker = new google.maps.Marker({
        map:map,
        position: location,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: i
        });
        
        // Push the marker to the array of markers.
        markers.push(marker);

        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
        popInfoWindow(this);
        }); 
        
        // Create mouseover and mouseout event to switch the marker icon color
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
          
        bounds.extend(marker.position);
    } //for loop 

    //Extend the boundaries of the map for each marker
    map.fitBounds(bounds);  
}

 // function to decoration marker icon color
 function makeMarkerIcon(markerColor) {
        let markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
 }

 //This function populates and opens the infowindow when the marker is clicked
 popInfoWindow = function (marker)  {
     if (infoWindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
          infoWindow.setContent('');
          infoWindow.marker = marker;
          // Make sure the marker property is cleared if the infoWindow is closed.
          infoWindow.addListener('closeclick', function() {
            infoWindow.marker = null;
          });
          
          //Bounce the marker for 750 ms
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 750);

          infoWindow.open(map, marker);
          let wikiUrl = "https://en.wikipedia.org/w/api.php?"+
                      "action=opensearch&search=" + marker.title +
                      "&format=json&callback=wikiCallback";
          let placeUrl = '';
          let contentString = '';

          //get the place url of the marker that is clicked using Wikipedia API    
          //get the streetview only after getting response from Wiki API       
          $.ajax({
              url: wikiUrl,
              dataType: "jsonp"
          }).done(function(response){
              let article = response[3][0];
              //Populate the wiki link only if the wiki page url is available
              if (article != null) {
                  placeUrl = '<div>' +'<a href="' + article + '"target="_blank"> ' + marker.title + '</a></div>';
              }
              
          }).fail(function(){
              placeUrl = '<div>' + 'Wikipedia data is not available' + '</div>';
          }).always(function(jqXHR, textStatus){
              if (textStatus != "success") {
                  placeUrl = '<div>' + 'Wikipedia data is not available' + '</div>';
              } 
              else {
                    // Use streetview service to get the closest streetview image within
                    // 50 meters of the markers position
                    let streetViewService = new google.maps.StreetViewService();
                    let radius = 50;
                    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
              }});

          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
          function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
              let nearStreetViewLocation = data.location.latLng;
              let heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position);
              contentString = placeUrl + '<div id="pano"></div>';
                infoWindow.setContent(contentString);
                let panoramaOptions = {
                  position: nearStreetViewLocation,
                  pov: {
                    heading: heading,
                    pitch: 30
                  }
                };
              let panorama = new google.maps.StreetViewPanorama(
                document.getElementById('pano'), panoramaOptions);
            } else {
              contentString = placeUrl + '<div>' + marker.title + '</div>' + 
                '<div>No Street View Found</div>';
              infoWindow.setContent(contentString);
            }
          }
        }
 };

 ko.applyBindings(new AppViewModel());

 function loadMapError () {
     alert("Your map can't be loaded properly.");
     //ko.applyBindings(new AppViewModel());
 };
