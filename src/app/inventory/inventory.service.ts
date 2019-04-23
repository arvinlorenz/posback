import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { TokenService } from "../shared/token.service";
@Injectable({providedIn:'root'})
export class InventoryService{

    skuResponse;
    private skuResponseUpdated = new Subject<any>();
    skuDetails;

    suppliers;
    public editSupplier = new Subject<any>();

    basePath:string = '/images';

    constructor(private http: HttpClient, private router: Router, private tokenService: TokenService){}
    
    setSkuDetails(skuDetails){
        this.skuResponse = skuDetails;
        this.skuResponseUpdated.next(this.skuResponse);
      }
    
    getSkuDetailsUpdateListener(){
        return this.skuResponseUpdated.asObservable();
    }

    getSkuDetails(sku:string){
        let url = `${this.tokenService.getServer()}/api/Stock/GetStockItemsByKey`;
        let params = {
            stockIdentifier:{
                "Key": sku,
                "LocationId": "00000000-0000-0000-0000-000000000000"
              }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    getItemImage(StockItemId){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetInventoryItemImages`;
        let params = {
            inventoryItemId:StockItemId
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    getInventoryItems(){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetInventoryItems`;
        let params = {
            view: {"Id":"3d30afaf-426f-4132-8430-7983a4eb2631","Name":"virtual","Mode":"All","Source":"All","SubSource":"Show all","CountryCode":"All","CountryName":"All","Listing":"All","ShowOnlyChanged":false,"IncludeProducts":"NotArchived","Filters":[{"FilterName":"Available","DisplayName":"Available","FilterNameExact":[],"Field":"Int","Condition":"Greater","ConditionDisplayName":"Greater","Value":"0"}],"Columns":[{"ColumnName":"SKU","DisplayName":"SKU","Group":"General","Field":"String","SortDirection":"None","Width":150,"IsEditable":false},{"ColumnName":"Title","DisplayName":"Title","Group":"General","Field":"String","SortDirection":"None","Width":250,"IsEditable":true},{"ColumnName":"Barcode","DisplayName":"Barcode","Group":"General","Field":"String","SortDirection":"None","Width":130,"IsEditable":true},{"ColumnName":"RetailPrice","DisplayName":"Retail","Group":"General","Field":"Double","SortDirection":"None","Width":100,"IsEditable":true},{"ColumnName":"PurchasePrice","DisplayName":"Purchase","Group":"General","Field":"Double","SortDirection":"None","Width":75,"IsEditable":true},{"ColumnName":"StockLevel","DisplayName":"Level","Group":"Stock","Field":"Int","SortDirection":"None","Width":75,"IsEditable":true},{"ColumnName":"InOrder","DisplayName":"In Open Orders","Group":"Stock","Field":"Int","SortDirection":"None","Width":75,"IsEditable":false},{"ColumnName":"Available","DisplayName":"Available","Group":"Stock","Field":"Int","SortDirection":"None","Width":75,"IsEditable":false},{"ColumnName":"MinimumLevel","DisplayName":"Minimum Level","Group":"Stock","Field":"Int","SortDirection":"None","Width":75,"IsEditable":true},{"ColumnName":"Tracked","DisplayName":"Tracked","Group":"General","Field":"Boolean","SortDirection":"None","Width":75,"IsEditable":false}],"Channels":[],"IsSearchRequired":true},
            stockLocationIds: ["00000000-0000-0000-0000-000000000000"],
            startIndex: 1,
            itemsCount: 100,
            preloadChilds: false
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    getItemDetails(StockItemId){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetInventoryItemById`;
        let params = {
                id: StockItemId,
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    getPostalServices(){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetPostalServices`;
        let params = {}
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    getCategories(){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetCategories`;
        let params = {}
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    getPackageGroups(){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetPackageGroups`;
        let params = {}
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    setQuantity(sku:string,quantity:string){
        let url = `${this.tokenService.getServer()}/api/Stock/SetStockLevel`;
        let params = {
            stockLevels:[{
                "SKU": sku,
                "LocationId": "00000000-0000-0000-0000-000000000000",
                "Level": quantity
              }]
            };
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    setBinRack(StockItemId:string,bin:string){
        let url = `${this.tokenService.getServer()}/api/Inventory/UpdateItemLocations`;
        let params = {
            itemLocations:[{
                "StockLocationId": "00000000-0000-0000-0000-000000000000",
                "LocationName": "Default",
                "BinRack": bin,
                "StockItemId": StockItemId
              }]
            };
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    getNewItemNumber(){
        let url = `https://as-ext.linnworks.net//api/Inventory/GetNewItemNumber`;
        let params = {};
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    getBinRackDetail(inventoryItemId: string){
        let url = `https://as-ext.linnworks.net//api/Inventory/GetInventoryItemLocations`;
        let params = {inventoryItemId:inventoryItemId};
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    updateInventoryItemExtendedProperties(details){
        let url = `${this.tokenService.getServer()}/api/Inventory/UpdateInventoryItemExtendedProperties`;
        let params = {
            inventoryItemExtendedProperties:details
            };
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    updateInventoryItem(details, itemStockId){
        let url = `${this.tokenService.getServer()}/api/Inventory/UpdateInventoryItem`;
    
        // let params = {
        //     inventoryItem: {
        //         "VariationGroupName":"",
        //         "Quantity":details.quantity,
        //         "InOrder":details.inOrder,
        //         "Due":details.due,
        //         "MinimumLevel":details.minimumLevel,
        //         "Available":details.available,
        //         "CreationDate":null,
        //         "IsCompositeParent":false,
        //         "ItemNumber":details.itemNumber,
        //         "ItemTitle":details.itemTitle,
        //         "BarcodeNumber":details.barcodeNumber,
        //         "MetaData":"",
        //         "isBatchedStockType":false,
        //         "PurchasePrice":details.purchasePrice,
        //         "RetailPrice":details.retailPrice,
        //         "PostalServiceId":details.postalServiceId,
        //         "PostalServiceName":null,"CategoryId":details.packageGroupId,
        //         "CategoryName":null,"PackageGroupId":details.categoryId,
        //         "PackageGroupName":null,"Height":details.height,"Width":details.width,"Depth":details.depth,"Weight":details.weight,
        //         "InventoryTrackingType":0,"StockItemId":itemStockId,
        //         "currentBatchType":0,"Dim":729}
        //     }
        let params = {
            inventoryItem: {
                "VariationGroupName":"","Quantity":details.quantity,"InOrder":details.inOrder,"Due":details.due,"MinimumLevel":details.minimumLevel,
                "Available":details.available,"CreationDate":null,"IsCompositeParent":false,"ItemNumber":details.itemNumber,
                "ItemTitle":details.itemTitle,"BarcodeNumber":details.barcodeNumber,"MetaData":"","isBatchedStockType":false,
                "PurchasePrice":details.purchasePrice,"RetailPrice":details.retailPrice,"PostalServiceId":details.postalServiceId,
                "PostalServiceName":null,"CategoryId":details.categoryId,"CategoryName":null,"PackageGroupId":details.packageGroupId,
                "PackageGroupName":null,"Height":details.height,"Width":details.width,"Depth":details.depth,"Weight":details.weight,
                "InventoryTrackingType":0,"StockItemId":itemStockId,"currentBatchType":0,"Dim":180000}
            }
            console.log('params', params)
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);


        
    }

   uploadImageToLinn(imageUrl,stockItemId){
        let url = `${this.tokenService.getServer()}/api/Inventory/AddImageToInventoryItem`;
        let params = {
            request:{"ItemNumber": stockItemId,
                    "StockItemId": stockItemId,
                    "IsMain": true,
                    "ImageUrl": imageUrl
                }
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return this.http.post(url,params,options)
    }

    // upload(image,stockItemId){
    //     let storageRef = firebase.storage().ref();
    //     this.uploadTask = storageRef.child(`${this.basePath}/${image.name}`).put(image);
    //     this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    //         (snapshot:any)=>{
    //             image.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        
    //     },
    //     (error)=>{
    //         console.log(error)
    //     },
    //     async()=>{
    //         this.saveFileData(image)
    //         //let downloadUrl = await this.uploadTask.snapshot.ref.getDownloadURL();
           
            
            
            
            
    //     })
    // }
    // private saveFileData(image) {
    //     this.db.list(`${this.basePath}/`).push(image);
    //   }

    getAllSuppliers(){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetSuppliers`;
        let params = {
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }


    getSuppliers(StockItemId){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetStockSupplierStat`;
        let params = {
            inventoryItemId:StockItemId
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    getSupplierByIndex(i){
        return this.suppliers[i];
    }

    getInventoryItemExtendedProperties(StockItemId){
        let url = `${this.tokenService.getServer()}/api/Inventory/GetInventoryItemExtendedProperties`;
        let params = {
            inventoryItemId:StockItemId
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
    setSuppliers(suppliers){
        this.suppliers = suppliers;
    }
    addSuppliersToNewCreatedInventory(suppliers){
        let url = `${this.tokenService.getServer()}/api/Inventory/CreateStockSupplierStat`;
        let params = {
            itemSuppliers:[...suppliers]
            };
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }
 
    editSupplierListener(){
        return this.editSupplier.asObservable();
    }
    updateSupplierStat(data,supplierID,stockItemId){
        let url = `${this.tokenService.getServer()}/api/Inventory/UpdateStockSupplierStat`;
        let params = {
            itemSuppliers:[
                {
                  "IsDefault": true,
                  "Supplier": data.supplier,
                  "SupplierID": supplierID,
                  "Code": data.code,
                  "SupplierBarcode": data.barCode,
                  "LeadTime": data.leadTime,
                  "PurchasePrice": data.purchasePrice,
                  "MinPrice":data.minPrice,
                  "MaxPrice":data.maxPrice,
                  "AveragePrice": data.averagePrice,
                  "AverageLeadTime": data.averageLeadTime,
                  "SupplierMinOrderQty": data.supplierMinOrderQty,
                  "SupplierPackSize": data.supplierPackSize,
                  "SupplierCurrency": data.supplierCurrency,
                  "StockItemId": stockItemId
                }]
            }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    addInventoryItem(item){
        let url = `${this.tokenService.getServer()}/api/Inventory/AddInventoryItem `;
        let params = {
            inventoryItem:{
                ...item
            }
        }
        const options = {  headers: new HttpHeaders().set('Authorization', this.tokenService.getToken()) };
        return  this.http.post(url,params,options);
    }

    
}