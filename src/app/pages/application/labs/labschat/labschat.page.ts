import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { LabsService } from 'src/app/services/labs.service';
import { UserService } from 'src/app/services/userservice.service';

@Component({
  selector: 'app-labschat',
  templateUrl: './labschat.page.html',
  styleUrls: ['./labschat.page.scss'],
})
export class LabschatPage implements OnInit {

  public socketEvetSubscription: Subscription;
  public messages = []

  public msg: string;

  //test vars
  order: string = '5f85d2c85be5532208edbc52'
  user: string = '5fa5831387d66c6cdd7bf823'

  constructor(public labsservices: LabsService,
    public userservice: UserService,
    private socket: Socket) { }

  ngOnInit() {

    //this.socket.connect();
    this.socketEvetSubscription = this.socket.fromEvent(this.order).subscribe((message: any) => {

      let chatMsg;
      let splitMsg = message.split(':')

      if (splitMsg[0] === 'Doctor')
        chatMsg = { source: 'doctor', msg: splitMsg[1] }
      else
        chatMsg = { source: 'patient', msg: splitMsg[1] }

      this.messages.push(chatMsg)

    }, (err) => console.log(err))

    this.socket.emit('join-room', {
      "room": this.order,
      "user": this.user
    })

  }

  sendMessage() {

    if (this.msg != '') {
      // const chatMsg = { source: 'addressee', msg: this.msg }
      // this.messages.push(chatMsg)

      this.socket.emit('message', {
        'room': this.order,
        'user': this.user,
        'message': this.msg
      })

      this.msg = ''
    }

  }

  killSocketSubscription() {
    this.socketEvetSubscription.unsubscribe();
  }

}
