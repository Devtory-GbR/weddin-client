<template>
  <div>
    <q-layout view="hHh lpR fff">
      <q-header bordered class="bg-white text-primary">
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" class="q-mr-sm" to="/" />
          <img style="max-height: 40px; max-width: 40px" />

          <q-toolbar-title>{{ $t("dashboard") }}</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page padding>
          <div class="row q-col-gutter-lg">
            <div class="col-xs-6 col-sm-5 col-md-4 col-lg-3">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Einladungen</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row">
                    <div class="col text-italic text-left">Keine Rückmeldung:</div>
                    <div class="col text-right">{{ invitationsNoResponse.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Zugesagt:</div>
                    <div class="col text-right">{{ invitationsConfirmed.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Abgesagt:</div>
                    <div class="col text-right">{{ invitationsCanceled.length }}</div>
                  </div>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row">
                    <div class="col text-italic text-bold text-left">Insgesamt:</div>
                    <div class="col text-right text-bold">{{ users.length }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-6 col-sm-5 col-md-4 col-lg-3">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Gäste</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row">
                    <div class="col text-italic text-bold text-left">Insgesamt:</div>
                    <div class="col text-right text-bold">{{ guests.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Erwachsene:</div>
                    <div class="col text-right">{{ guestsAdults.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Kinder:</div>
                    <div class="col text-right">{{ guestsChilds.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Babys:</div>
                    <div class="col text-right">{{ guestsBabys.length }}</div>
                  </div>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                  <div class="row">
                    <div class="col text-italic text-bold text-left">Zugesagt:</div>
                    <div class="col text-right text-bold">{{ guestsAttend.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Erwachsene:</div>
                    <div class="col text-right">{{ guestsAttendAdults.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Kinder:</div>
                    <div class="col text-right">{{ guestsAttendChilds.length }}</div>
                  </div>
                  <div class="row">
                    <div class="col text-italic text-left">Babys:</div>
                    <div class="col text-right">{{ guestsAttendBabys.length }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-xs-6 col-sm-5 col-md-4 col-lg-3">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Sonstiges</div>
                </q-card-section>
                <q-separator />
                <q-card-section>
                  <div class="row">
                    <div class="text-subtitle1">Hotel</div>
                    <div class="col text-right">
                      {{ invitationsConfirmedWithHotel.length }} ({{
                      getGuestAttend(invitationsConfirmedWithHotel)
                      }})
                    </div>
                  </div>
                  <div class="row">
                    <div class="text-subtitle1">Shuttle</div>
                    <div class="col text-right">
                      {{ invitationsConfirmedWithShuttle.length }} ({{
                      getGuestAttend(invitationsConfirmedWithShuttle)
                      }})
                    </div>
                  </div>
                </q-card-section>
                <q-separator inset />

                <q-card-section v-for="(preference, index) in guestPreferences" :key="index">
                  <div class="text-subtitle1">{{ preference.attributes.label }}</div>

                  <div
                    class="row"
                    v-for="(preferencePos, indexb) in preference.attributes
                      .guest_prefrence_items.data"
                    :key="indexb"
                  >
                    <div class="col text-italic text-left">{{ preferencePos.attributes.label }}</div>
                    <div class="col text-right">
                      {{
                      getNumberPreference(
                      preference.attributes.key,
                      preferencePos.attributes.value
                      )
                      }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="q-gutter-sm q-mt-lg">
            <q-radio v-model="filter" val="all" label="Alle" />
            <q-radio v-model="filter" val="noResponse" label="Keine Rückmeldung" />
            <q-radio v-model="filter" val="canceled" label="Abgesagt" />
            <q-radio v-model="filter" val="confirmed" label="Zugesagt" />
            <q-radio v-model="filter" val="confirmedWithHotel" label="Zugesagt mit Hotel" />
            <q-radio v-model="filter" val="confirmedWithShuttle" label="Zugesagt mit Shuttle" />
            <q-radio v-model="filter" val="confirmedWithOther" label="Zugesagt mit Other" />
          </div>
          <q-table title="Einladungen" :rows="tableData" :columns="columns" row-key="id">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn
                    size="sm"
                    color="secondary"
                    round
                    dense
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <q-table
                    :rows="props.row.guests"
                    :columns="columnsGuest"
                    row-key="id"
                    v-model:pagination="pagination"
                    :rows-per-page-options="[0]"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
<script src="./dashboard.js"></script>
