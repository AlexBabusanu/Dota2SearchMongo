import { NgModule } from "@angular/core";
import { RouterModule, Routes, Router } from "@angular/router";
import { HomeComponent } from "./core/home/home.component";
import { UserComponent } from "./core/user/user.component";
import { FriendListComponent } from "./core/user/friend-list/friend-list.component";
import { InventoryComponent } from "./core/user/inventory/inventory.component";

const routes:Routes = [
    {path:"", component:HomeComponent},
    {path:":id", component:UserComponent, children:[
        {path:"", component:FriendListComponent},
        {path:"inventory/:id", component:InventoryComponent}
    ]}
]

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ],
    exports:[
        RouterModule
    ]
})


export class AppRouter{}