import { Component, Input, OnInit } from '@angular/core';
import { StreamManager } from 'openvidu-browser';


@Component({
    selector: 'user-video',
    styles: [
        `
            ov-video {
                width: 100%;
                height: auto;
                float: left;
            
            div div { 
                position: absolute;
                bottom: 0;
                width: 100%;
                text-align: center;
                background: rgba(0,0,0,0.6);
                padding: 8px;
                font-size: 12px;
                color: #ffffff;
                border-bottom-right-radius: 4px;
            }
            p {
                margin: 0;
            }
        `,
    ],
    template: `
        <div>
            <ov-video [streamManager]="streamManager"></ov-video>
            <div><p>{{nickname}}</p></div>
        </div>`,
})
export class UserVideoComponent implements OnInit {

    nickname = '';

    @Input()
    streamManager: StreamManager;

    ngOnInit() {
        this.getNicknameTag();
    }

    getNicknameTag() {
        try {
            this.nickname = JSON.parse(this.streamManager.stream.connection.data).clientData;
        } catch (err) {
            console.error('ClientData is not JSON formatted');
            this.nickname = 'unknown';
        }
    }
}
