if(window.location.pathname == "/"){
    $ondelete = $(".table tbody td a.delete")
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request ={
            "url": `http://localhost:3000/api/blogs/${id}`,
            "method": "DELETE"

        }

        if(confirm("Are you sure you want to delete?")){
            $.ajax(request).done(function(response){
                alert("Data deleted successfully.");
                location.reload
            })
        }
    })
}