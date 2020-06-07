<template>
  <q-page class="flex flex-center">
    <section class="fit row wrap justify-evenly items-center content-around">
      <q-card>
        <q-card-section>
          <q-form class="col-auto self-start q-gutter-md">
            <q-input
              v-model="prodCost"
              outlined
              type="number"
              prefix="£"
              label="My production costs"
              hint="How much does it cost me to make it?"
              :rules="minWageRule"
            />
            <q-select
              v-model="clientType"
              outlined
              :options="clientTypes"
              label="Who is it for?"
              transition-show="scale"
              transition-hide="scale"
              :rules="fillingRule"
            />
            <fieldset>
              <legend>Extras</legend>
              <q-toggle
                v-for="extra in extraServices"
                :key="extra.label"
                v-model="extra.enabled"
                color="primary"
                keep-color
              >
                <q-input
                  v-model="extra.value"
                  outlined
                  type="number"
                  prefix="£"
                  :label="extra.label"
                  :rules="fillingRule"
                  :dark="extra.enabled"
                  :bg-color="extra.enabled ? 'primary' : ''"
                />
              </q-toggle>
            </fieldset>

            <q-input
              v-model="margin"
              outlined
              type="number"
              suffix="%"
              label="Margin (if any)"
              :rules="fillingRule"
            />
            <label for="brandAdvantage">My brand's advantage:</label>
            <q-slider
              v-model="brandAdvantage"
              outlined
              :rules="fillingRule"
              :min="0"
              :max="maxBrandAdvantage"
              markers
              label
              label-always
            />

            <q-input
              v-model="annualProductValue"
              outlined
              type="number"
              prefix="£"
              label="Annual value of product"
              hint="How much profit will the client gain after a year thanks to that?"
              :rules="fillingRule"
            />

            <q-input
              v-model="contingency"
              outlined
              type="number"
              suffix="%"
              label="Contingency"
              hint="Over-time work fee increase"
              :rules="fillingRule"
            />
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="col-auto self-center q-gutter-md">
        <q-card-section v-show="totalCost">
          <p>
            <u>Your</u> production cost: <em>£ {{ tpc }}</em>
          </p>
          <p>
            <u>Your</u> commission on the client's annual value: <em>{{ Math.round(commission * 10000) / 100 }} %</em>
          </p>
          <p>
            Total billable cost: <strong>£ {{ totalCost }}</strong> (£ {{ totalNetCost }} net)
          </p>
          <p>
            ... with <em>contingency</em> included: <strong>£ {{ totalContingentCost }} </strong> (£ {{ totalContingentNetCost }} net)
          </p>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script>
import prettify from 'pretty-num';

const PN_CONFIG = { precision: 2, thousandsSeparator: ',' };

// TODO Figure what the V = brandAdvantage + productValue is actually supposed to be, the price? a multiplier?
export default {
  data() {
    return {
      prodCost: 18 * 200, // 0
      clientType: '',
      clientTypes: [
        {
          label: 'Individual',
          value: 0,
          costMultiplier: 1
        },
        {
          label: 'Team',
          value: 1,
          costMultiplier: 1.2
        },
        {
          label: 'Enterprise',
          value: 2,
          costMultiplier: 1.4
        }
      ],
      extraServices: [
        {
          label: 'Logo Design',
          value: 6.5,
          enabled: false
        },
        {
          label: 'UI Design',
          value: 8,
          enabled: false
        },
        {
          label: 'Hosting',
          value: 2,
          enabled: true
        },
        {
          label: 'Ads',
          value: 12,
          enabled: false
        },
        {
          label: 'Analytics',
          value: 1.5,
          enabled: false
        }
      ],
      margin: 0,
      annualProductValue: 0,
      contingency: 15,
      brandAdvantage: 0,
      maxBrandAdvantage: 10,
      fillingRule: [(val) => !!val || 'Field is required'],
      minWageRule: [(val) => val > 8.2 || 'This is lower minimum wage for your age group is £8.20!']
    };
  },
  computed: {
    totalProdCost() {
      const extras = this.extraServices
        .filter((extra) => extra.enabled)
        .reduce((sum, { value }) => sum + value, 0);
      return this.prodCost + extras;
    },
    actualMargin() {
      return this.margin / 100;
    },
    actualContingency() {
      return this.contingency / 100;
    },
    tpc() {
      return prettify(this.totalProdCost, PN_CONFIG)
    },
    commission() {
      const STARTING_BRAND_COMMISSION = 0.1;
      return 0.01 * this.brandAdvantage + STARTING_BRAND_COMMISSION;
    },
    annualValueCommission() {
      return this.annualProductValue * this.commission;
    },
    billableCost() {
      return Math.max(this.totalProdCost * (1 + this.actualMargin), this.annualValueCommission);
    },
    totalCost() {
      return prettify(this.billableCost, PN_CONFIG);
    },
    totalNetCost() {
      return prettify(this.billableCost * 0.8, PN_CONFIG);
    },
    totalContingentCost() {
      return prettify(this.billableCost * (1 + this.actualContingency), PN_CONFIG);
    },
    totalContingentNetCost() {
      return prettify(this.billableCost * (1 + this.actualContingency) * .8, PN_CONFIG);
    }
  }
};
</script>

<style></style>
