$(document).ready(function(){
  function displayHTMLTable(data){
    var table = "<table class='table table-striped'>";
    data.forEach(function(row, index){
      table += "<tr>";
      row.forEach(function(datum, ind){
        var header_class = "";
        header_class = data[0][ind].trim();
        if(header_class == 'Preferred Parent'){
          header_class = 'oldPreferredParent'
        }else if(header_class == 'Preferred Parent Label'){
          header_class = 'oldPreferredParentLabel'
        }

        if(index == 0){
          if(datum == 'Preferred Parent'){
            datum = 'oldPreferredParent'
          }else if(datum == 'Preferred Parent Label'){
            datum = 'oldPreferredParentLabel'
          }
        }
        table += "<td class='"+ header_class +"'>" + datum + "</td>";
      });
      var parent_title = '';
      var preferred_parent_title = '';
      var preferred_parent_label = '';
      var nested_parent = '';
      var nested_label = '';
      if(index == 0){
        parent_title = 'Parents';
        preferred_parent_title = 'Preferred Parent';
        preferred_parent_label = 'Preferred Parent Label';
        if(row.indexOf('Preferred Parent') != -1){
          nested_parent = 'agpv1';
          nested_label = 'agpv1Label';
        }
        populationHeaderOptionsToFindParent(row);
      }
      table += "<td class='parents'>" + parent_title + "</td>";
      table += "<td class='preferredParent " + nested_parent +"'>" + preferred_parent_title + "</td>";
      table += "<td class='preferredParentLabel " + nested_label + "'>" + preferred_parent_label + "</td>";
      table += "</tr>";
    });
    table += "</table>";
    $('#csvDataTable').html(table);
  }

  function populationHeaderOptionsToFindParent(csvHeaders){
    var options = '';
    csvHeaders.forEach(function(header, index){
      if(header.trim() == 'Preferred Parent'){
        header = 'oldPreferredParent';
      }else if(header.trim() == 'Preferred Parent Label'){
        header = 'oldPreferredParentLabel';
      }
      options += "<option value='" + header.trim() + "'>" + header + "</option>"
    });
    $('#csvTitleForParent').html(options);
  }

  // Load csv file
  $('#filename').change(function(e){
    var ext = $("input#filename").val().split(".").pop().toLowerCase();
    if($.inArray(ext, ["csv"]) == -1) {
      alert('Upload CSV');
      return false;
    }
    if (e.target.files != undefined) {
      var data = null;
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(event){
        var csvData = event.target.result;
        data = $.csv.toArrays(csvData);
        displayHTMLTable(data);
        $('.parentColumn').removeClass('hidden');
        $('.s007.csvData.hidden').removeClass('hidden');
        $('#exportTable').show();
        $('#findParent').show();
      }
    }
  });

  // Find parent
  $('#findParent').click(function(e){
    var parentColumnHeader = $('#csvTitleForParent').val();
    if(parentColumnHeader == '' || parentColumnHeader == undefined){
      alert('Please select the parent header');
      return false;
    }

    $('.' + parentColumnHeader).each(function(index){
      if(index !== 0){
        var element = this;
        var $this = $(this);
        var code = $this.text();
        var url = "https://api.snochillies.com/ClinicalTerms/ParentConcepts?Concept=null&sType=all&Code=" + code;
        var request = $.ajax({
          url: url,
          method: 'GET'
        });
        request.done(function(response){
          console.log("Success API request");
          json_data = JSON.parse(response.replace(/&quot;/g, "\""));
          var parent_html = ""
          var multipleParentSeperator = "";

          json_data.forEach(function(data, index){
            parent_html += "<div class='parentId badge badge-pill badge-light'>" + data["ConceptID"] + ":" + data["Term"] + multipleParentSeperator + "</div>"
          });
          var $parent_column = $($(element).siblings('.parents')[0]);
          $parent_column.html(parent_html);
          // $('#findParent').hide();
        });
        request.fail(function(jqXHR, textStatus){
          alert("Request failed for " + code);
        });
      }
    });
  });

  $(document).on('click', '.parentId', function(){
    var $this = $(this);
    var $table = $($this.parents('table'));
    $this.siblings('.badge-primary').removeClass('badge-primary').addClass('badge-light')
    $this.toggleClass('badge-primary');
    $this.toggleClass('badge-light');
    // $table.find('.parentId').removeClass('badge-primary');
    // $this.removeClass('badge-light').addClass('badge-primary');
  });

  $('#aggregateParent').click(function(e){
    var allSelectedParents = $('table').find('.parentId.badge-primary').map(function(){ return $(this).text() }).toArray();
    $('tr').each(function(index){
      var selectedFound = false;
      if(index != 0){
        var $selectedParent = $(this).find('.parentId.badge-primary');
        if($selectedParent.length > 0){
          $(this).find('.preferredParent')[0].innerText = $selectedParent[0].innerText.split(':')[0];
          $(this).find('.preferredParentLabel')[0].innerText = $selectedParent[0].innerText.split(':')[1]
        }else{
          // parents and slected parents
          var $this = $(this);
          var parentsValue = $(this).find('.parents div').map(function(){ return $(this).text() }).toArray();
          parentsValue.forEach(function(val){
            if(allSelectedParents.indexOf(val) != -1){
              selectedFound = true;
              $this.find('.preferredParent')[0].innerText = val.split(':')[0];
              $this.find('.preferredParentLabel')[0].innerText = val.split(':')[1]
            }
          });
          if(!selectedFound){
            var parentColumnHeader = $('#csvTitleForParent').val();
            var parentColumnHeaderLabel = 'tgt_label';
            if(parentColumnHeader != 'tgt_code'){
              parentColumnHeaderLabel = parentColumnHeader + 'Label';
            }
            $(this).find('.preferredParent')[0].innerText = $(this).find('.' + parentColumnHeader)[0].innerText;

            $(this).find('.preferredParentLabel')[0].innerText = $(this).find('.' + parentColumnHeaderLabel)[0].innerText;
          }
        }
      }
    });
  });

  $('#exportTable').click(function(e){
    $('table').tableToCSV();
  });
//End of ready function
})


