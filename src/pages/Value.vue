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
            <u>Your</u> production cost: <em>{{ money(totalProdCost) }}</em>
          </p>
          <p>
            <u>Your</u> commission on the client's annual value: <em>{{ perc(commission) }}</em>
          </p>
          <p>
            Total billable cost: <strong>{{ money(totalCost) }}</strong> ({{ money(totalNetCost) }}
            net)
          </p>
          <p>
            ... with <em>contingency</em> included:
            <strong>{{ money(totalContingentCost) }} </strong> ({{ money(totalContingentNetCost) }}
            net)
          </p>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script>
const gbpForm = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const timeForm = new Intl.NumberFormat('en-GB', { style: 'unit', unit: 'hour' });
const percForm = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const CLIENT_TYPES = [
  {
    label: 'Individual',
    value: 1
  },
  {
    label: 'Team',
    value: 1.2
  },
  {
    label: 'Enterprise',
    value: 1.4
  }
];

// TODO Figure what the V = brandAdvantage + productValue is actually supposed to be, the price? a multiplier?
export default {
  data() {
    return {
      prodCost: 18 * 200, // 0
      clientTypes: CLIENT_TYPES,
      clientType: CLIENT_TYPES[0],
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
    commission() {
      const STARTING_BRAND_COMMISSION = 0.1;
      return 0.01 * this.brandAdvantage + STARTING_BRAND_COMMISSION;
    },
    annualValueCommission() {
      return this.annualProductValue * this.commission;
    },
    totalCost() {
      return Math.max(
        this.totalProdCost * (1 + this.actualMargin) * this.clientType.value,
        this.annualValueCommission
      );
    },
    totalNetCost() {
      return this.totalCost * 0.8;
    },
    totalContingentCost() {
      return this.totalCost * (1 + this.actualContingency);
    },
    totalContingentNetCost() {
      return this.totalContingentCost * 0.8;
    }
  },
  methods: {
    money(data) {
      return gbpForm.format(data);
    },
    hours(data) {
      return hrForm.format(data);
    },
    weeks(data) {
      return wkForm.format(data);
    },
    months(data) {
      return moForm.format(data);
    },
    perc(data) {
      return percForm.format(data);
    }
  }
};
</script>

<style></style>
