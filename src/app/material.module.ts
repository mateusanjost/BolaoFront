import { NgModule } from '@angular/core';
import {
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
    } from '@angular/material';

const MATERIAL_MODULES = [
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
];

@NgModule({
    imports: [
        MATERIAL_MODULES
    ],
    exports: [
        MATERIAL_MODULES
    ]
})

export class MaterialModule {}