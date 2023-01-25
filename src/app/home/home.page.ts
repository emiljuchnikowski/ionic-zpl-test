import {AfterContentInit, ChangeDetectorRef, Component} from '@angular/core';
import ZbtPrinter from '@sbenitez73/cordova-ble-zbtprinter';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterContentInit {
  printers = new Set<{ address: string, name: string }>();

  get list(): Array<{ address: string, name: string }> {{
    return Array.from(this.printers);}
  }

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterContentInit() {
    ZbtPrinter.discoverPrinters(
      async (address: any) => {
        const name = await ZbtPrinter.getPrinterName(address);
        this.printers.add({address, name});
        this.cd.detectChanges();
      }, (error: any) => {
        alert(error);
      }
    ).then();
  }

  async onPrint(printer: { address: string; name: string }): Promise<void> {
    try {
      const printText = "^XA^FO20,20^A0N,25,25^FDThis is a ZPL test.^FS^XZ";
      await ZbtPrinter.print( printer.address, printText);
      alert("Printed successfully");
    } catch (e) {
      alert('error: ' + JSON.stringify(e));
    }
  }
}
