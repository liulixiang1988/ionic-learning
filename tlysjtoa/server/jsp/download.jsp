<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<aa:http id="file"></aa:http>

<% 

String filename = aa.getReqHeaderValue("url");

String[] strs = filename.split("NewName=");

//附件名可以从url中截取

filename = strs[1];

//有些web系统的附件名，不在url中，或者从附件所在页面的响应内容里无法找到

//那么附件名必然可以在这个附件的http请求的响应头信息中获得

//那么可以通过aa.rsp.getHeader方法取获取响应头中的附件名
//filename=aa.rsp.getHeader("filename");
//System.out.println(filename);
%>

<aa:choose>

       <%--从客户端请求头判断是否是下载请求  --%>

      <aa:when test="<%=aa.req.isDownload()%>">

               <aa:file-download  dsId="file" filename="<%=filename %>"/>
       </aa:when>

      <aa:otherwise>

              <aa:file-preview dsId="file" filename="<%=filename %>"/>
       </aa:otherwise>

</aa:choose>