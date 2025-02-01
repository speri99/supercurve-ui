import { Component, OnInit, ViewChild } from '@angular/core';
import { endOfMonth } from 'date-fns';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { MainService } from '../main.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';


let sourceOptions: Array<{ value: string; category: string; count: number }> = [
  {
    value: "Nizampet",
    category: "ABC",
    count: 2
  },
  {
    value: "KPHB",
    category: "ABC",
    count: 2
  }
];

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  @ViewChild('addresstext') addresstext: any;
  autocomplete: any;
  @ViewChild('map') mapElement: any;

   bookingRequest:any={
    "location":"",
    "vechicleNumber":"",
    "bookingTime":""
  }

  constructor(private mainService:MainService,private message: NzMessageService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getPlaceAutocomplete();
    }, 2000)
  }
  loading = false;
  inputValue?: string;
  options: Array<{ value: string; category: string; count: number }> = [

  ];

  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.options = sourceOptions.filter(ele => ele.value == value);
  }
  locationSlection(event:any){
    this.bookingRequest.location=event.source.nzValue;
  }

  private getRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  startValue: Date | null = null;
  endValue: Date | null = null;
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
    console.log('handleStartOpenChange', open);
  }

  handleEndOpenChange(open: boolean): void {
    console.log('handleEndOpenChange', open);
  }

  private getPlaceAutocomplete() {
    try {
      this.autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, (
        {
          componentRestrictions: { country: ['UK', 'IN'] },
          types: ['locality', 'sublocality', 'postal_code']
        }));
      google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
        const place = this.autocomplete.getPlace();
        // this.address = place.formatted_address;

      });
    } catch (e) {

    }
  }

  createBooking() {
    this.mainService.createBooking(this.bookingRequest).subscribe(data=>{
      this.message.success("Your booking is successfull!!");
    },(err)=>{
      this.message.error(err.error.message);
    })

  }

  onChangeDate(event: any) {
    var date= new Date(event);
    this.bookingRequest.bookingTime=date.toString();
    this.bookingRequest.bookingTime=moment(date).format('DD-MM-yyyy HH:mm:ss');
  }

}
