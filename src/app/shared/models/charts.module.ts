import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
    imports: [CommonModule, NgxChartsModule],
    exports: [NgxChartsModule]
  })
  export class ChartsModule { }