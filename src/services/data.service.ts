import { Logs } from "selenium-webdriver";
import { Item,IItem } from "../models/data.interface";
import {Product} from "../models/products.model";


class ItemService {
    async saveItemsService(data: Partial<IItem>): Promise<IItem> {
        const item = new Item(data);
        return await item.save();
    }
                                                                                                                                   
    async getDataToCharts(): Promise<any> {

        const data:any = {
            dataGroupedByScore: [],
            dataGroupeDataBySeller: []
        }
        
        const products =  await Product.find();
        if (products != undefined) {
            
            data.dataGroupedByScore = GroupeDataByScore(products)
            data.dataGroupeDataBySeller = GroupeDataBySeller(products)

        }
        return  data
    }

    async getItem(id: string): Promise<IItem | null> {
        return await Product.findById(id);
    }

    async getItems() {
        return await Product.find();
    }

    async updateItem(id: string, data: Partial<IItem>): Promise<IItem | null> {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteItem(id: string): Promise<IItem | null> {
        return await Product.findByIdAndDelete(id);
    }



}

function GroupeDataByScore(data:any[]){
    let scores:string[] = []
    let scores_grouped:any[] = []
    data.map((data:any)=> {
        scores.push(data.popularity)
    })

    scores.push('5.0')

    scores =  [... new Set(scores)]

    scores.forEach((score) => {
       let data_aux = {
        total:0,
        score: score
        }
        data.forEach((data) => {
            if (score == data.popularity) {
                data_aux.total++
            }
        })
        scores_grouped.push(data_aux)
    })

    let datasets:any[] = []
    let test = {
        labels: [] as any,
        data: [] as any

    }



    scores_grouped.map((score:any) => {
    
        const dataset = {
            label: score.score,
            data: [score.total]
        }

        datasets.push(dataset)

        test.labels.push(score.score)
        test.data.push(score.total)

    })

   return datasets
    
}

function GroupeDataBySeller(data:any[]){
    let sellers:string[] = []
    let sales_grouped_by_seller:any[] = []
    data.map((data:any)=> {
        sellers.push(data.saller)
    })

    


    sellers =  [... new Set(sellers)]

        sellers.forEach((seller) => {

            let aux_seller_data = {
                seller:seller,
                total_sales:0
                
            }

            data.forEach((data) => {
                if (seller == data.saller) {
                    aux_seller_data.total_sales ++
                }
            })

            sales_grouped_by_seller.push(aux_seller_data)

        })


        let datasets:any[] = []


        sales_grouped_by_seller.map((seller:any) => {
        
            const dataset = {
                label: seller.seller,
                data: [seller.total_sales]
            }
    
            datasets.push(dataset)
    

    
        })
    

   return datasets
    
}

export default new ItemService();
