let app = new Vue({
    el: '#compute_app',
    delimiters: ['${', '}'],
    data: {
        mask_market_cost: 3.5,          // This is the market cost of a mask
        mask_local_cost: 0.5,           // This is the final cost of a mask which has been home made

        // Individual price for goods required to make a mask
        elastic_cost_per_unit: 0.25,
        tissue_cost_per_square_meter: 5.94,     // In square meter
        plastic_sleeve_cost_per_meter: 0.27,
        // Quantity of material required for 1 mask
        layer_number: 3,
        tissue_per_layer: 0.004,                // In square meter
        elastic_per_mask: 2,
        plastic_sleeve_length_per_pocket: 1,
        mask_per_pocket: 10,

        city_population: null,
        mask_politic: 1,
        desired_mask_number: null,
        desired_date_day_str: '',
        desired_date_month_str: '',
        desired_date_year_str: '',

        sewing_machine_number: null
    },
    computed: {
        recommended_mask_number: function(){
            return 10 * this.city_population * parseInt(this.mask_politic);
        },
        recommended_mask__market_cost: function(){
            return this.mask_market_cost * this.recommended_mask_number;
        },
        home_made_mask_price_per_unit: function(){

        },

        // Computing functions to get mask price
        tissue_quantity_per_mask: function(){
            return this.tissue_per_layer * this.layer_number;
        },
        tissue_quantity_for_production: function(){
            return this.tissue_quantity_per_mask * this.recommended_mask_number;
        },
        elastic_quantity_for_production: function(){
            return this.elastic_per_mask * this.recommended_mask_number;
        },
        pocket_quantity_for_production: function(){
            return this.recommended_mask_number / this.mask_per_pocket;
        },
        plastic_sleeve_quantity_for_production: function(){
            return this.plastic_sleeve_length_per_pocket * this.pocket_quantity_for_production;
        },
        tissue_cost_for_production: function(){
            return this.tissue_quantity_for_production * this.tissue_cost_per_square_meter;
        },
        elastic_cost_for_production: function(){
            return this.elastic_quantity_for_production * this.elastic_cost_per_unit;
        },
        plastic_sleeve_cost_for_production: function(){
            return this.plastic_sleeve_quantity_for_production * this.plastic_sleeve_cost_per_meter;
        },
        total_production_cost: function(){
            return Math.floor((this.tissue_cost_for_production + this.elastic_cost_for_production + this.elastic_cost_for_production + this.plastic_sleeve_cost_for_production)*100)/100;
        },

        number_of_days_between_now_and_desired: function(){
            let desired_date = new Date(parseInt(this.desired_date_year_str), parseInt(this.desired_date_month_str)-1, parseInt(this.desired_date_day_str))
            let now_date = new Date();
            let difference = Math.abs(desired_date - now_date);
            let diffDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
            return diffDays;
        },
        computed_masks_per_day: function(){
            return Math.ceil(this.desired_mask_number / this.number_of_days_between_now_and_desired);
        },


        desired_date: {
            get: function(){
                let return_str = this.desired_date_day_str;
                if(this.desired_date_month_str.length > 0)
                    return_str += "/" + this.desired_date_month_str;
                if(this.desired_date_year_str.length > 0)
                    return_str += "/" + this.desired_date_year_str;
                return return_str;
            },
            set: function(newValue){
                let newValue_splt = newValue.split('/');
                this.desired_date_day_str = newValue_splt[0];
                if(newValue_splt.length > 1)
                    this.desired_date_month_str = newValue_splt[1];
                if(newValue_splt.length > 2)
                    this.desired_date_year_str = newValue_splt[2];
            }
        },
        total_market_mask_cost: function(){
            return this.mask_market_cost * this.desired_mask_number;
        },
        total_local_mask_cost: function(){
            return this.mask_local_cost * this.desired_mask_number;
        }
    }
});