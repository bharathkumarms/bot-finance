import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { map } from 'rxjs/operators/map';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map'

export class ChatMessage {
    messageId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    toUserId: string;
    time: number | string;
    message: string;
    status: string;
}

export class Answers{
    answers:Array<Answer>
}

export class Answer{
    answer: string
}

export class UserInfo {
    id: string;
    name?: string;
    avatar?: string;
}

@Injectable()
export class ChatService {

    constructor(private http: HttpClient,
                private events: Events) {
    }

    mockNewMsg(msg) {
        const mockMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: '210000198410281948',
            userName: 'Bot Finance',
            userAvatar: './assets/to-user.jpg',
            toUserId: '140000198202211138',
            time: Date.now(),
            message: msg.message,
            status: 'success'
        };

        setTimeout(() => {
            this.events.publish('chat:received', mockMsg, Date.now())
        }, Math.random() * 1800)
    }

    getMsgList(): Observable<ChatMessage[]> {
        const msgListUrl = './assets/mock/msg-list.json';
        return this.http.get<any>(msgListUrl)
          .pipe(map(response => response.array));
    }

    sendMsg(msg: ChatMessage) {
        const mockMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: '210000198410281948',
            userName: 'Bot Finance',
            userAvatar: './assets/to-user.jpg',
            toUserId: '140000198202211138',
            time: Date.now(),
            message: 'test',
            status: 'success'}

        const headers = new HttpHeaders({'Ocp-Apim-Subscription-Key':'e073edc6811a4a2dbbce16094b1328cd'});

        return this.http.post("https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/2612cdfb-908c-40ff-8d54-14910d6abf2d/generateAnswer", { 'question': msg.message }, { headers: headers })
        .map(res => JSON.stringify(res))
        .map(output => {
            var parsedValue = JSON.parse(output)
            mockMsg.message = parsedValue['answers'][0].answer;
            return mockMsg;
        }).toPromise().catch(e=>{
            mockMsg.message = "Please try in 30-60sec. Too many request or check your network.";
            return mockMsg;
        });
    }

    getUserInfo(): Promise<UserInfo> {
        const userInfo: UserInfo = {
            id: '140000198202211138',
            name: 'You',
            avatar: './assets/user.jpg'
        };
        return new Promise(resolve => resolve(userInfo));
    }

}
