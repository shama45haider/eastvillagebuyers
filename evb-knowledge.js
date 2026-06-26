/* East Village Buyers — Knowledge Base Loader */
(function () {
  'use strict';

  var EVBKnowledge = {
    data: null,
    loaded: false,

    load: function (callback) {
      if (this.loaded && this.data) {
        if (callback) callback(this.data);
        return;
      }
      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'evb-knowledge.json', true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || xhr.status === 0) {
            try {
              self.data = JSON.parse(xhr.responseText);
              self.loaded = true;
            } catch (e) {
              self.data = { chunks: [], contact: {}, pages: [] };
              self.loaded = true;
            }
          } else {
            self.data = { chunks: [], contact: {}, pages: [] };
            self.loaded = true;
          }
          if (callback) callback(self.data);
        }
      };
      xhr.send();
    },

    getAllEntries: function () {
      if (!this.data || !this.data.chunks) return [];
      return this.data.chunks;
    },

    getContact: function () {
      if (!this.data || !this.data.contact) return {};
      return this.data.contact;
    },

    getPages: function () {
      if (!this.data || !this.data.pages) return [];
      return this.data.pages;
    },

    searchByKeywords: function (query) {
      if (!this.data || !this.data.chunks) return [];
      var q = query.toLowerCase().trim();
      if (!q) return [];

      var words = q.split(/\s+/).filter(function (w) { return w.length > 2; });
      if (words.length === 0) return [];

      var scored = [];
      this.data.chunks.forEach(function (chunk) {
        var text = ((chunk.text || '') + ' ' + (chunk.question || '') + ' ' + (chunk.section || '')).toLowerCase();
        var score = 0;
        words.forEach(function (w) {
          if (text.indexOf(w) !== -1) score++;
        });
        if (score > 0) {
          scored.push({ chunk: chunk, score: score });
        }
      });

      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, 10).map(function (s) { return s.chunk; });
    },

    getByProductType: function (type) {
      if (!this.data || !this.data.chunks) return [];
      var t = type.toLowerCase();
      return this.data.chunks.filter(function (chunk) {
        return (chunk.page || '').toLowerCase().indexOf(t) !== -1 ||
               (chunk.pageLabel || '').toLowerCase().indexOf(t) !== -1;
      });
    },

    getByQuestion: function (query) {
      if (!this.data || !this.data.chunks) return [];
      var q = query.toLowerCase().trim();
      return this.data.chunks.filter(function (chunk) {
        return chunk.type === 'faq' && chunk.question && chunk.question.toLowerCase().indexOf(q) !== -1;
      });
    }
  };

  // Auto-load on init
  EVBKnowledge.load();

  // Expose globally
  window.EVBKnowledge = EVBKnowledge;
})();
