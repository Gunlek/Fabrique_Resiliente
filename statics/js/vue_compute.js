let today = new Date();
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
        nb_mask_per_person: 2,          // C1
        mask_market_cost: 3.5,          // This is the market cost of a mask
        mask_local_cost: 1,             // E
        startup_delay: 2,
        // Variables
        city_population: null,      // A
        mask_politic: 1,            // B
        desired_mask_number: null,
        desired_date_day_str: today.getDate().toString(),
        desired_date_month_str: (today.getMonth()+1).toString(),
        desired_date_year_str: today.getFullYear().toString(),

        // Second estimator
        // Parameters
        prod_time_centralized: 4*3600,   // In seconds
        prod_time_semi_centralized: 1.5*3600,   // In seconds
        production_time_per_machine: 400, // In seconds
        // Variables
        sewing_machine_number_estimation: '1',
        sewing_machine_number: 0,
        average_sewing_machine_per_people: 1/1000,
        allocated_area: 0,

        ref_tag: null
    },
    methods: {
        get_reference_data: function(){
            let super_this = this;
            let form_data = {};
            form_data['city_population'] = this.city_population.toString();
            form_data['mask_politic'] = this.mask_politic.toString();
            form_data['desired_mask_number'] = this.desired_mask_number.toString();
            form_data['desired_date'] = this.desired_date.toString();
            form_data['nb_mask_per_person'] = this.nb_mask_per_person.toString();
            form_data['mask_market_cost'] = this.mask_market_cost.toString();
            form_data['mask_local_cost'] = this.mask_local_cost.toString();
            form_data['startup_delay'] = this.startup_delay.toString();
            
            form_data['sewing_machine_number_estimation'] = this.sewing_machine_number_estimation.toString();
            form_data['sewing_machine_number'] = this.sewing_machine_number.toString();
            form_data['average_sewing_machine_per_people'] = this.average_sewing_machine_per_people.toString();
            form_data['computed_sewing_machine_in_city'] = this.computed_sewing_machine_in_city.toString();
            form_data['allocated_area'] = this.allocated_area.toString();
            form_data['prod_time_centralized_hours'] = this.prod_time_centralized_hours.toString();
            form_data['prod_time_semi_centralized_hours'] = this.prod_time_semi_centralized_hours.toString();
            form_data['production_time_per_machine'] = this.production_time_per_machine.toString();
            form_data['layer_number'] = this.layer_number.toString();
            form_data['tissue_per_layer'] = this.tissue_per_layer.toString();
            form_data['elastic_per_mask'] = this.elastic_per_mask.toString();
            form_data['plastic_sleeve_length_per_pocket'] = this.plastic_sleeve_length_per_pocket.toString();
            form_data['mask_per_pocket'] = this.mask_per_pocket.toString();
            form_data['elastic_cost_per_unit'] = this.elastic_cost_per_unit.toString();
            form_data['tissue_cost_per_square_meter'] = this.tissue_cost_per_square_meter.toString();
            form_data['plastic_sleeve_cost_per_meter'] = this.plastic_sleeve_cost_per_meter.toString();
            $.ajax({
                url: '/reference/insert-reference',
                data: 'form_data='+JSON.stringify(form_data)+'&ref_tag='+super_this.ref_tag,
                type: 'post',
                content: 'json',
                success: function(data){
                }
            });
        },

        set_reference_data: function(){
            let super_desc = this;
            $.ajax({
                url: '/reference/get-reference',
                data: 'ref_tag='+super_desc.ref_tag,
                type: 'get',
                content: 'json',
                success: function(data){
                    let form_data = JSON.parse(data);
                    super_desc.city_population = parseInt(form_data['city_population']);
                    super_desc.mask_politic = parseFloat(form_data['mask_politic']);
                    super_desc.desired_mask_number = parseInt(form_data['desired_mask_number']);
                    super_desc.desired_date = form_data['desired_date'];
                    super_desc.nb_mask_per_person = parseInt(form_data['nb_mask_per_person']);
                    super_desc.mask_market_cost = parseFloat(form_data['mask_market_cost']);
                    super_desc.mask_local_cost = parseFloat(form_data['mask_local_cost']);
                    super_desc.startup_delay = parseInt(form_data['startup_delay']);
                    
                    super_desc.sewing_machine_number_estimation = parseInt(form_data['sewing_machine_number_estimation']);
                    super_desc.sewing_machine_number = parseInt(form_data['sewing_machine_number']);
                    super_desc.average_sewing_machine_per_people = parseFloat(form_data['average_sewing_machine_per_people']);
                    super_desc.allocated_area = parseFloat(form_data['allocated_area']);
                    super_desc.prod_time_centralized_hours = form_data['prod_time_centralized_hours'];
                    super_desc.prod_time_semi_centralized_hours = form_data['prod_time_semi_centralized_hours'];
                    super_desc.production_time_per_machine = form_data['production_time_per_machine'];
                    super_desc.layer_number = form_data['layer_number'];
                    super_desc.tissue_per_layer = form_data['tissue_per_layer'];
                    super_desc.elastic_per_mask = form_data['elastic_per_mask'];
                    super_desc.plastic_sleeve_length_per_pocket = form_data['plastic_sleeve_length_per_pocket'];
                    super_desc.mask_per_pocket = form_data['mask_per_pocket'];
                    super_desc.elastic_cost_per_unit = form_data['elastic_cost_per_unit'];
                    super_desc.tissue_cost_per_square_meter = form_data['tissue_cost_per_square_meter'];
                    super_desc.plastic_sleeve_cost_per_meter = form_data['plastic_sleeve_cost_per_meter'];
                }
            });
        }
    },
    computed: {
        // C
        recommended_mask_number: function(){
            return this.nb_mask_per_person * this.city_population * parseFloat(this.mask_politic);
        },
        // D
        recommended_mask_market_cost: function(){
            return this.mask_market_cost * this.recommended_mask_number;
        },
        difference_between_local_and_market: function() {
            return this.mask_market_cost*this.desired_mask_number - this.total_production_cost;
        },
        difference_between_local_and_market_per_mask: function() {
            return this.difference_between_local_and_market / this.recommended_mask_number;
        },

        number_of_days_between_now_and_desired: function(){
            let desired_date_object = new Date(parseInt(this.desired_date_year_str), parseInt(this.desired_date_month_str)-1, parseInt(this.desired_date_day_str))
            let now_date = new Date();
            let difference = Math.abs(desired_date_object - now_date);
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
            return Math.ceil(8 * 1.3 * this.sewing_machine_number);
        },
        local_size_in_square_meter_semi_centralized_model: function(){
            return Math.ceil(8 * 0.3 * this.sewing_machine_number);
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
            return Math.ceil(this.desired_mask_number / (this.computed_dayli_production_centralized)) - this.number_of_days_between_now_and_desired + parseInt(this.startup_delay) > 0 ? Math.ceil(this.desired_mask_number / (this.computed_dayli_production_centralized)) - this.number_of_days_between_now_and_desired + parseInt(this.startup_delay) : 0;
        },
        possible_centralized_production_in_time: function(){
            return this.computed_dayli_production_centralized * (this.number_of_days_between_now_and_desired - parseInt(this.startup_delay))
        },
        buy_need_centralized_production: function(){
            return Math.ceil(this.desired_mask_number - this.possible_centralized_production_in_time > 0 ? this.desired_mask_number - this.possible_centralized_production_in_time : 0);
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
            return Math.ceil(this.desired_mask_number / (this.computed_dayli_production_semi_centralized)) - this.number_of_days_between_now_and_desired + parseInt(this.startup_delay) > 0 ? Math.ceil(this.desired_mask_number / (this.computed_dayli_production_semi_centralized)) - this.number_of_days_between_now_and_desired + parseInt(this.startup_delay) : 0;
        },
        possible_semi_centralized_production_in_time: function(){
            return this.computed_dayli_production_semi_centralized * (this.number_of_days_between_now_and_desired - parseInt(this.startup_delay))
        },
        buy_need_semi_centralized_production: function(){
            return Math.ceil(this.desired_mask_number - this.possible_semi_centralized_production_in_time > 0 ? this.desired_mask_number - this.possible_semi_centralized_production_in_time : 0);
        },
        amortization: function(){
            console.log(this.production_time_per_machine);
            return Math.ceil( 150 / (this.difference_between_local_and_market_per_mask*(3600/this.production_time_per_machine)) );
        },

        /*
         * Table details
         */
        volunteers: function(){
            return Math.ceil(1.3 * this.sewing_machine_number);
        },
        volunteers_in_workshop_centralized: function(){
            return Math.ceil(this.volunteers);
        },
        volunteers_in_workshop_semi_centralized: function(){
            return Math.ceil(0.3 * this.sewing_machine_number);
        },
        
        // Table 2
        // Computing functions to get mask price
        tissue_quantity_per_mask: function(){
            return this.tissue_per_layer * this.layer_number;
        },
        tissue_quantity_for_production: function(){
            return this.tissue_quantity_per_mask * this.desired_mask_number;
        },
        elastic_quantity_for_production: function(){
            return this.elastic_per_mask * this.desired_mask_number;
        },
        pocket_quantity_for_production: function(){
            return this.desired_mask_number / this.mask_per_pocket;
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
            return Math.floor(this.mask_local_cost * this.desired_mask_number);
            // return Math.floor((this.tissue_cost_for_production + this.elastic_cost_for_production + this.elastic_cost_for_production + this.plastic_sleeve_cost_for_production)*100)/100;
        },
        cutting_people: function(){
            return Math.ceil(0.3 * this.sewing_machine_number);
        },
        scisors_number: function(){
            return Math.ceil(0.3 * this.sewing_machine_number);
        },
        iron_number: function(){
            return Math.ceil(0.2 * this.sewing_machine_number);
        },
        packing_people: function(){
            return Math.ceil(0.1 * this.sewing_machine_number);
        },
        visor_quantity: function(){
            return this.volunteers * 1.5;
        },

        required_area_size_centralized: function(){
            return Math.ceil(6 * 1.3 * this.sewing_machine_number);
        },
        required_area_size_semi_centralized: function(){
            return Math.ceil(6 * 0.3 * this.sewing_machine_number);
        }
    },
    mounted: function(){
        let super_this = this;
        let today = new Date();
        var datepicker = new tui.DatePicker('#wrapper', {
            date: new Date(),
            input: {
                element: '#date-input',
                format: 'dd/MM/yyyy'
            },
            selectableRanges: [
                [today, new Date(today.getFullYear() + 10, today.getMonth(), today.getDate())]
            ]
        });
        datepicker.on('change', function() {
            var newDate = datepicker.getDate();
            super_this.desired_date_day_str = newDate.getDate().toString();
            super_this.desired_date_month_str = (newDate.getMonth()+1) < 10 ? "0"+(newDate.getMonth()+1).toString() : (newDate.getMonth()+1).toString();
            super_this.desired_date_year_str = newDate.getFullYear().toString();
            super_this.desired_date = super_this.desired_date_day_str + "/" + super_this.desired_date_month_str + "/" + super_this.desired_date_year_str;
        });
    }
});