from rest_framework.filters import BaseFilterBackend

class TaskFilterBackend(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        category = request.query_params.get("category")
        status = request.query_params.get("status")
        pmin = request.query_params.get("priority_min")
        pmax = request.query_params.get("priority_max")
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        if status:
            queryset = queryset.filter(status=status)
        if pmin:
            queryset = queryset.filter(priority_score__gte=float(pmin))
        if pmax:
            queryset = queryset.filter(priority_score__lte=float(pmax))
        return queryset
