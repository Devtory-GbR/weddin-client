import { mapState, mapGetters } from "vuex";
import { api } from "boot/axios";

const columnsGuestBase = [
  {
    name: "name",
    required: true,
    label: "Name",
    field: "name",
    sortable: true,
    align: "left",
  },
  {
    name: "stageOfLife",
    label: "Lebensalter",
    field: "stageOfLife",
    align: "left",
  },
  {
    name: "attend",
    required: true,
    label: "Zugesagt",
    field: "attend",
    sortable: true,
    align: "right",
  },
];
export default {
  name: "Dashboard",
  data() {
    return {
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          field: "id",
          sortable: true,
          align: "left",
        },
        {
          name: "name",
          required: true,
          label: "Name",
          field: "invitationname",
          sortable: true,
          align: "left",
        },
        {
          name: "remark",
          label: "Bemerkung",
          field: "remark",
          align: "left",
        },
        {
          name: "attend",
          required: true,
          label: "Zugesagt",
          field: "attend",
          sortable: true,
          align: "right",
        },
        {
          name: "count",
          required: true,
          label: "Anzahl",
          field: (row) => `${row.guestsCountAttend}/${row.guestsCount}`,
        },
      ],
      pagination: {
        rowsPerPage: 0,
      },
      filter: "all",
      isLoading: false,
    };
  },
  created() {
    this.$q.loading.show();
    this.$store
      .dispatch("statistics/loadData")
      .then(() => {
        this.$q.loading.hide();
      })
      .catch((e) => {
        alert(e);
        this.$q.loading.hide();
      });
  },
  computed: {
    ...mapState({
      users: (state) => state.statistics.users,
      guests: (state) => state.statistics.guests,
      guestPreferences: (state) => state.masterdata.guestPreferences,
      columnsGuest: (state) => {
        const arr = columnsGuestBase.map((item) => item);
        state.masterdata.guestPreferences.forEach((item) => {
          arr.push({
            name: item.attributes.key,
            label: item.attributes.label,
            field: (row) => {
              if (
                row.guest_preference &&
                row.guest_preference[item.attributes.key] &&
                row.guest_preference[item.attributes.key].items
              ) {
                return row.guest_preference[item.attributes.key].items.reduce(
                  (acc, curr) => {
                    const label =
                      item.attributes.guest_prefrence_items.data.filter(
                        (pos) => pos.attributes.value === curr
                      )[0].attributes.label;
                    if (acc === "") {
                      acc = label;
                    } else {
                      acc += ", " + label;
                    }
                    return acc;
                  },
                  ""
                );
              }
              return "";
            },
          });
          if (item.attributes.canFillOther) {
            arr.push({
              name: item.attributes.key + "_other",
              label: item.attributes.label + " Other",
              field: (row) => {
                if (
                  row.guest_preference &&
                  row.guest_preference[item.attributes.key] &&
                  row.guest_preference[item.attributes.key].other
                ) {
                  return row.guest_preference[item.attributes.key].other;
                }
                return "";
              },
            });
          }
        });
        return arr;
      },
    }),
    ...mapGetters({
      invitationsConfirmed: "statistics/invitationsConfirmed",
      invitationsCanceled: "statistics/invitationsCanceled",
      invitationsNoResponse: "statistics/invitationsNoResponse",
      invitationsConfirmedWithHotel: "statistics/invitationsConfirmedWithHotel",
      invitationsConfirmedWithShuttle:
        "statistics/invitationsConfirmedWithShuttle",
      invitationsConfirmedWithOther: "statistics/invitationsConfirmedWithOther",
      guestsAdults: "statistics/guestsAdults",
      guestsChilds: "statistics/guestsChilds",
      guestsBabys: "statistics/guestsBabys",
      guestsAttend: "statistics/guestsAttend",
      guestsAttendAdults: "statistics/guestsAttendAdults",
      guestsAttendChilds: "statistics/guestsAttendChilds",
      guestsAttendBabys: "statistics/guestsAttendBabys",
    }),
    tableData() {
      if (this.filter === "all") {
        return this.users;
      } else if (this.filter === "noResponse") {
        return this.invitationsNoResponse;
      } else if (this.filter === "confirmed") {
        return this.invitationsConfirmed;
      } else if (this.filter === "canceled") {
        return this.invitationsCanceled;
      } else if (this.filter === "confirmedWithHotel") {
        return this.invitationsConfirmedWithHotel;
      } else if (this.filter === "confirmedWithShuttle") {
        return this.invitationsConfirmedWithShuttle;
      } else if (this.filter === "confirmedWithOther") {
        return this.invitationsConfirmedWithOther;
      }
    },
  },
  methods: {
    async checkPasswords() {
      let allFine = true;
      this.isLoading = true;

      const header = api.defaults.headers.common.Authorization;
      delete api.defaults.headers.common.Authorization;

      for (const user of this.users) {
        const authReq = {
          identifier: user.username,
          password: user.username,
        };
        console.info(`check User: ${user.username}...`);
        try {
          await api({
            url: `auth/local`,
            data: authReq,
            method: "POST",
          });
        } catch (e) {
          allFine = false;
          console.error("Code ist wrong... User: " + user.username);
        }

        await new Promise((resolve) => setTimeout(() => resolve(), 7500));
      }
      if (!allFine) {
        alert(
          "not all passwords are correkt pls check the usernames and passwords again."
        );
      }
      api.defaults.headers.common.Authorization = header;
      this.isLoading = false;
    },
    getGuestAttend(users) {
      return users.reduce((acc, curr) => {
        return (acc += curr.guestsCountAttend);
      }, 0);
    },
    getNumberPreference(key, value) {
      return this.guestsAttend.reduce((acc, curr) => {
        if (
          curr.guest_preference &&
          curr.guest_preference[key] &&
          curr.guest_preference[key].items
        ) {
          acc += curr.guest_preference[key].items.filter(
            (item) => item === value
          ).length;
        }
        return acc;
      }, 0);
    },
  },
};
