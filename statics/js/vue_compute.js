let app = new Vue({
    el: '#compute_app',
    delimiters: ['${', '}'],
    data: {        
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

        // First estimator
        // Parameters
        nb_mask_per_person: 2,
        mask_market_cost: 3.5,          // This is the market cost of a mask
        mask_local_cost: 1,
        startup_delay: 2,
        // Variables
        city_population: null,
        mask_politic: 1,
        desired_mask_number: null,
        desired_date_day_str: '',
        desired_date_month_str: '',
        desired_date_year_str: '',

        // Second estimator
        // Parameters
        prod_time_centralized: 4*3600,   // In seconds
        prod_time_semi_centralized: 1.5*3600,   // In seconds
        production_time_per_machine: 2 * 60, // In seconds
        // Variables
        sewing_machine_number_estimation: '1',
        sewing_machine_number: 0,
        average_sewing_machine_per_people: 1/1000,
    },
    computed: {
        recommended_mask_number: function(){
            return this.nb_mask_per_person * this.city_population * parseInt(this.mask_politic);
        },
        recommended_mask_market_cost: function(){
            return this.mask_market_cost * this.recommended_mask_number;
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
            return Math.floor(this.mask_local_cost * this.recommended_mask_number);
            // return Math.floor((this.tissue_cost_for_production + this.elastic_cost_for_production + this.elastic_cost_for_production + this.plastic_sleeve_cost_for_production)*100)/100;
        },
        difference_between_local_and_market: function() {
            return this.recommended_mask_market_cost - this.total_production_cost;
        },

        number_of_days_between_now_and_desired: function(){
            let desired_date = new Date(parseInt(this.desired_date_year_str), parseInt(this.desired_date_month_str)-1, parseInt(this.desired_date_day_str))
            let now_date = new Date();
            let difference = Math.abs(desired_date - now_date);
            let diffDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
            return diffDays;
        },
        computed_masks_per_day: function(){
            return Math.ceil(this.desired_mask_number / (this.number_of_days_between_now_and_desired - this.startup_delay));
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
        },

        /*
         * Production model algorithms
        */
        computed_sewing_machine_in_city: function(){
            this.sewing_machine_number = Math.floor(this.city_population * this.average_sewing_machine_per_people);
            return Math.floor(this.city_population * this.average_sewing_machine_per_people);
        },
        local_size_in_square_meter_centralized_model: function(){
            return Math.ceil(6 * 1.3 * this.sewing_machine_number);
        },
        local_size_in_square_meter_semi_centralized_model: function(){
            return Math.ceil(6 * 0.3 * this.sewing_machine_number);
        },
        computed_dayli_production_centralized: function(){
            return this.sewing_machine_number * this.prod_time_centralized / this.production_time_per_machine;
        },
        prod_time_centralized_hours: {
            get: function(){
                return this.prod_time_centralized / 3600;
            },
            set: function(hours){
                this.prod_time_centralized = hours * 3600;
            }
        },
        extended_days_centralized_production: function(){
            return Math.ceil(this.desired_mask_number / (this.computed_dayli_production_centralized)) - this.number_of_days_between_now_and_desired + parseInt(this.startup_delay);
        },
        possible_centralized_production_in_time: function(){
            return this.computed_dayli_production_centralized * (this.number_of_days_between_now_and_desired - parseInt(this.startup_delay))
        },
        buy_need_centralized_production: function(){
            return this.desired_mask_number - this.possible_centralized_production_in_time;
        },
        prod_time_semi_centralized_hours: {
            get: function(){
                return this.prod_time_semi_centralized / 3600;
            },
            set: function(hours){
                this.prod_time_semi_centralized = hours * 3600;
            }
        },
        computed_dayli_production_semi_centralized: function(){
            return this.sewing_machine_number * this.prod_time_semi_centralized / this.production_time_per_machine;
        },
        extended_days_semi_centralized_production: function(){
            return Math.ceil(this.desired_mask_number / (this.computed_dayli_production_semi_centralized)) - this.number_of_days_between_now_and_desired + parseInt(this.startup_delay);
        },
        possible_semi_centralized_production_in_time: function(){
            return this.computed_dayli_production_semi_centralized * (this.number_of_days_between_now_and_desired - parseInt(this.startup_delay))
        },
        buy_need_semi_centralized_production: function(){
            return this.desired_mask_number - this.possible_semi_centralized_production_in_time;
        },
    }
});