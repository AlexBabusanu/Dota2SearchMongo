import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { FriendListComponent } from "./user/friend-list/friend-list.component";
import { InventoryComponent } from "./user/inventory/inventory.component";
import { AppRouter } from "../app-router.module";
import { CommonModule } from "@angular/common";
import { SteamService } from "../shared/steamApi.service";
import { PageService } from "../shared/pagination.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations:[
        HeaderComponent,
        HomeComponent,
        UserComponent,
        FriendListComponent,
        InventoryComponent
    ],
    imports:[
        AppRouter,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports:[
        HeaderComponent
    ],
    providers: [
        SteamService,
        PageService
    ]
})

export class CoreModule{}