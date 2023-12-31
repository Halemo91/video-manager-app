import { Component, Input } from '@angular/core';

@Component({
  selector: 'mi-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() primary?: boolean = false;
  @Input() text: string = 'Button';
  @Input() disabled?: boolean = false;
  @Input() isDelete?: boolean = false;
  @Input() secondary?: boolean = false;
}
