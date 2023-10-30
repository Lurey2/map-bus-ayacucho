import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from '../core/core.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MarketIconComponentComponent } from './components/market-icon-component/market-icon-component.component' ;


@NgModule({
    declarations: [ DialogConfirmComponent, MarketIconComponentComponent],
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatDatepickerModule,
        OverlayModule,
        DirectivesModule,
        PipesModule,
        RouterModule,
        LeafletModule,
        MatIconModule,
        CoreModule,
        NgxSpinnerModule,
    ],
    exports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatDatepickerModule,
        OverlayModule,
        DirectivesModule,
        PipesModule,
        RouterModule,
        DialogConfirmComponent,
        LeafletModule,
        MatIconModule,
        NgxSpinnerModule,
        MarketIconComponentComponent
    ],
    providers: [

    ]
})
export class SharedModule {}
