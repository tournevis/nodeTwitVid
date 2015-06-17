SFD send;

import oscP5.*;
import netP5.*;
import processing.video.*;

Movie movie;
OscP5 oscP5;
int videoSwitch;
NetAddress myRemoteLocation;
void setup() {
  size(400,400, P3D);
  //
  send = new SFD(this);
  oscP5 = new OscP5(this,12000);
  myRemoteLocation = new NetAddress("127.0.0.1",12000);
  

}
void draw() {

background(100);
  stroke(255);
  line(50, 50, mouseX, mouseY);
  if(videoSwitch == 1) {
    
  }
   movie = new Movie(this, "../videoTweet0.mov"); 
     movie.loop();
  image(movie, 0, 0, width, height);
  send.update();
}
void movieEvent(Movie m) {
  m.read();
}

void oscEvent(OscMessage theOscMessage) {
  /* print the address pattern and the typetag of the received OscMessage */
  if(theOscMessage.checkAddrPattern("switchVid0")==true) {
    /* check if the typetag is the right one. */
    if(theOscMessage.checkTypetag("i")) {
      /* parse theOscMessage and extract the values from the osc message arguments. */
      int firstValue = theOscMessage.get(0).intValue();  
      videoSwitch = theOscMessage.get(0).intValue();
       
      print("### received an osc message /test with typetag ifs.");
      println(" values: "+firstValue);
      return;
    }  
  } 
}
