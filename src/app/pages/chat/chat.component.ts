import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef} from '@angular/core';
import { WebSocketService } from '../../backend/services/web-socket.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, MessagesModule, CardModule],
  providers: [MessageService],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked{

  public messages: string[] = [];
  public messageInput: string = '';
  @ViewChild('cardContainer') cardContainer!: ElementRef;
  // messagesW: Message[] = [];

  constructor(private webSocketService: WebSocketService, private messageService: MessageService) { }

  ngOnInit(): void {

    this,this.webSocketService.messages$.subscribe((message: string) => {
      this.messageService.add({severity:'secondary', summary:'Anonimo:', detail:message});
    });
  }

  ngAfterViewChecked() {
    if (this.cardContainer) {
      // Asegura que el scroll esté al final
      this.cardContainer.nativeElement.scrollTop = -this.cardContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage(): void {
    
    if(this.messageInput.trim()) {
      this.webSocketService.sendMessage(this.messageInput);
      this.messageInput = '';
    }
  }

}
