var app = new Vue({
    el: '#app',
    data() {
      return { 
        documents: [],
        currentDoc: {}
      }
    },
    mounted() {
      axios
        .get('/api/documents')
        .then(response => { 
          this.documents = response.data;
          this.currentDoc = this.documents[0];
        })
    },
    methods: {
      selectDocument(doc){
        this.currentDoc = doc
      },
      currentEntities(){
        let keys = _.chain(this.currentDoc.data)
          .keys()
          .filter(o => { return o != 'classifications' && o != 'uri'})
          .sort()
          .value()
        return keys;
      }

    }
  })