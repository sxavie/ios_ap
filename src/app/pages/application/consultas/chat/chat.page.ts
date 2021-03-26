import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewWillLeave } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  public socketEvetSubscription:Subscription;

  public msg:string;
  public messages = []

  
  constructor( private socket: Socket,
    private orderservice: OrderService,
    private userservice: UserService ) { }

  ngOnDestroy(): void {
    this.killSocketSubscription();
  }

  ngOnInit() {

    //this.socket.connect();
    this.socketEvetSubscription = this.socket.fromEvent(this.orderservice.consultResponse._id).subscribe( (message:any) => {

      let chatMsg;
      let splitMsg = message.split(':')

      if( splitMsg[0] === 'Doctor') 
        chatMsg = { source: 'doctor', msg: splitMsg[1] }
      else 
        chatMsg = { source: 'patient', msg: splitMsg[1] }

      this.orderservice.consultMessages.push(chatMsg)

    },(err) => console.log( err ))

    this.socket.emit('join-room', {
      "room": this.orderservice.consultResponse._id,
      "user": this.userservice.usuario._id
    })

  } 

  sendMessage(){

    if(this.msg != '') {
      // const chatMsg = { source: 'addressee', msg: this.msg }
      // this.messages.push(chatMsg)

      this.socket.emit('message', {
        'room': this.orderservice.consultResponse._id,
        'user': this.userservice.usuario._id,
        'message': this.msg
      })

      this.msg = ''
    }

  }

  killSocketSubscription(){
    this.socketEvetSubscription.unsubscribe();
  }

}
