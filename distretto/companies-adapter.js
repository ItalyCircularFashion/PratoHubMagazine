/* Adapter Distretto: the same documented companies used by the Magazine. */
(function(){
  var PH=window.PH;
  PH.aziende=window.PRATO_COMPANIES.map(function(company){
    var keys=company.sources.map(function(source,i){
      var key='company-'+company.id+'-'+i;
      PH.sources[key]={n:company.name+' · '+source.label+' · consultato il '+company.checkedAt,u:source.url};
      return key;
    });
    return {n:company.name,c:company.specialization,m:company.city,f:company.description,v:keys,recordId:company.id};
  });
})();
